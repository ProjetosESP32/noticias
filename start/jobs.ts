import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import File from 'App/Models/File'
import PortalNews from 'App/Models/PortalNews'
import Post from 'App/Models/Post'
import axios from 'axios'
import { CronJob } from 'cron'
import { JSDOM } from 'jsdom'
import mime from 'mime-types'
import { spawn } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const promiseSpawn = async (command: string, args: string[]) => {
  const spawnedProcess = spawn(command, args)

  return new Promise<void>((resolve, reject) => {
    spawnedProcess.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Rejected with code ${String(code)}`))
      }
    })

    spawnedProcess.on('error', code => {
      reject(new Error(`Rejected with code ${String(code)}`))
    })
  })
}

void new CronJob(
  '0 6,12,18 * * *',
  () => {
    void (async () => {
      try {
        Logger.info('Job started')
        Logger.debug('Getting news')
        const { data } = await axios.get('https://cba.ifmt.edu.br/conteudo/noticias/')
        const dom = new JSDOM(data)
        const newsElements = Array.from(dom.window.document.querySelectorAll('p.no-margin.espacamento-medio'))
        const news = newsElements.map(el => el.textContent).filter(el => typeof el === 'string') as string[]

        await PortalNews.query().delete()
        await PortalNews.createMany(news.map(description => ({ description })))

        Logger.debug('Getting news complete')
        Logger.debug('Getting instagram posts')

        const path = join(__dirname, '..', 'instagram_downloader.py')
        await promiseSpawn('python', [path])
        const baseDir = join(__dirname, '..', 'instagram')
        const dir = await readdir(baseDir)

        const promises = dir
          .filter(dir => dir.endsWith('jpg') || dir.endsWith('mp4'))
          .map(async path => {
            const fullPath = join(baseDir, path)
            const status = await stat(fullPath)
            const mimeType = mime.lookup(fullPath) || ''
            const ext = extname(fullPath)
            const name = `${cuid()}${ext}`
            const attachment = new Attachment({
              extname: ext.replace('.', ''),
              mimeType,
              name,
              size: status.size,
            })

            attachment.isPersisted = true

            const stream = createReadStream(fullPath)
            await Drive.putStream(name, stream)

            const fileInstance = await File.create({ data: attachment })
            await Post.create({ fileId: fileInstance.id })
          })
        await Promise.all(promises)

        Logger.debug('Getting instagram posts complete')
        Logger.info('Job complete')
      } catch (e) {
        Logger.error(e, 'Error in job')
      }
    })()
  },
  null,
  true,
  'America/Cuiaba',
)
