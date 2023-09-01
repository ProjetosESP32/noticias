import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import type NewsSession from 'App/Models/NewsSession'
import PostFile from 'App/Models/PostFile'
import { spawnAsync } from 'App/Utils/spawn_async'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { createReadStream } from 'node:fs'
import { JobQueue } from '../Utils/job_queue'

const FFMPEG_BIN = join(cwd(), 'utils', 'ffmpeg')

export interface VideoJobData {
  folderProcessPath: string
  filePath: string
  audioEnabled?: boolean
  priority?: boolean
  session?: NewsSession
}

const COMMON_AUDIO_CONFIG = ['-strict', 'experimental', '-b:a', '48k']
const OPUS_AUDIO_CONFIG = ['-c:a', 'opus', ...COMMON_AUDIO_CONFIG]
const AAC_AUDIO_CONFIG = ['-c:a', 'aac', ...COMMON_AUDIO_CONFIG]
const NO_AUDIO_CONFIG = ['-an']

const worker = async ({ folderProcessPath, filePath, audioEnabled, priority, session }: VideoJobData) => {
  const webmFile = `${cuid()}.webm`
  const mp4File = `${cuid()}.mp4`
  const webmOutputFile = join(folderProcessPath, webmFile)
  const mp4OutputFile = join(folderProcessPath, mp4File)

  await spawnAsync(FFMPEG_BIN, [
    '-i',
    filePath,
    '-c:v',
    'vp9',
    '-preset:v',
    'ultrafast',
    ...(audioEnabled ? OPUS_AUDIO_CONFIG : NO_AUDIO_CONFIG),
    webmOutputFile,
  ])
  await spawnAsync(FFMPEG_BIN, [
    '-i',
    filePath,
    '-c:v',
    'libx264',
    '-profile:v',
    'baseline',
    '-preset:v',
    'ultrafast',
    ...(audioEnabled ? AAC_AUDIO_CONFIG : NO_AUDIO_CONFIG),
    mp4OutputFile,
  ])

  await Drive.putStream(webmFile, createReadStream(webmOutputFile))
  await Drive.putStream(mp4File, createReadStream(mp4OutputFile))

  const webmStats = await Drive.getStats(webmFile)
  const mp4Stats = await Drive.getStats(mp4File)

  const webmAttachment = new Attachment({
    extname: 'webm',
    mimeType: 'video/webm',
    name: webmFile,
    size: webmStats.size,
  })
  const mp4Attachment = new Attachment({
    extname: 'mp4',
    mimeType: 'video/mp4',
    name: mp4File,
    size: mp4Stats.size,
  })

  webmAttachment.isPersisted = true
  mp4Attachment.isPersisted = true

  const postFileSaveData = {
    type: PostFileTypes.VIDEO,
    file: webmAttachment,
    fallbackFile: mp4Attachment,
    priority,
    audioEnabled,
  }

  if (session) {
    await session.related('postFiles').create(postFileSaveData)
  } else {
    await PostFile.create(postFileSaveData)
  }
}

const rejectionHandler = (err: unknown) => {
  Logger.error(err, 'Error in video converter job')
}

export const videoConvertQueue = new JobQueue(worker, rejectionHandler)
