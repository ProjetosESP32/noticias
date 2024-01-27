import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import PostFile from 'App/Models/PostFile'
import { execFile } from 'node:child_process'
import { createReadStream, type PathLike } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { promisify } from 'node:util'
import { JobQueue } from '../Utils/job_queue'

const FFMPEG_BIN = join(cwd(), 'utils', 'ffmpeg')

const execFileAsync = promisify(execFile)

export interface VideoJobData extends Record<string, unknown> {
  groupId: number
  sessionId: number | null
  folderProcessPath: string
  filePath: string
  audioEnabled?: boolean
  priority?: boolean
  extra?: Record<string, unknown>
}

const AAC_AUDIO_CONFIG = ['-c:a', 'aac', '-strict', 'experimental', '-b:a', '48k']
const NO_AUDIO_CONFIG = ['-an']

const noop = () => {}
const safeDeleteFile = async (path: PathLike) => unlink(path).catch(noop)
const safeDriveDelete = async (path: string) => Drive.delete(path).catch(noop)

const worker = async ({
  groupId,
  sessionId,
  folderProcessPath,
  filePath,
  audioEnabled,
  priority,
  extra,
}: VideoJobData) => {
  Logger.info(`starting convertion process of video ${filePath}`)
  const mp4File = `${cuid()}.mp4`
  const mp4OutputFile = join(folderProcessPath, mp4File)

  const trx = await Database.transaction()

  try {
    Logger.debug('ffmpeg x264')
    const x264Output = await execFileAsync(FFMPEG_BIN, [
      '-hide_banner',
      '-loglevel',
      'warning',
      '-i',
      filePath,
      '-c:v',
      'libx264',
      '-profile:v',
      'baseline',
      '-preset:v',
      'ultrafast',
      '-threads',
      '1',
      ...(audioEnabled ? AAC_AUDIO_CONFIG : NO_AUDIO_CONFIG),
      mp4OutputFile,
    ])
    Logger.debug(x264Output, 'x264 outputs')

    Logger.debug('moving to drive')
    await Drive.putStream(mp4File, createReadStream(mp4OutputFile))

    Logger.debug('drive getStats')
    const mp4Stats = await Drive.getStats(mp4File)

    const mp4Attachment = new Attachment({
      extname: 'mp4',
      mimeType: 'video/mp4',
      name: mp4File,
      size: mp4Stats.size,
    })

    mp4Attachment.isPersisted = true

    const postFileSaveData = {
      newsGroupId: groupId,
      newsSessionId: sessionId,
      type: PostFileTypes.VIDEO,
      file: mp4Attachment,
      priority,
      audioEnabled,
      extra,
    }

    Logger.debug('saving in database')
    await PostFile.create(postFileSaveData, { client: trx })

    await trx.commit()
    Logger.debug('process completed')
  } catch (err) {
    Logger.debug('process has error')
    await trx.rollback()
    await safeDriveDelete(mp4File)
    throw err
  } finally {
    Logger.debug('process ended')
    await Promise.all([safeDeleteFile(filePath), safeDeleteFile(mp4OutputFile)])
  }
}

const rejectionHandler = (err: unknown) => {
  Logger.error(err, 'Error in video converter job')
}

export const videoConvertQueue = new JobQueue<VideoJobData>('video-convert', worker, rejectionHandler)
