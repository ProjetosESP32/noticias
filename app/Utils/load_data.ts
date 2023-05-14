import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import File from 'App/Models/File'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import mime from 'mime-types'
import { createReadStream } from 'node:fs'
import { readdir, stat, rm } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { spawnAsync } from './spawn_async'
import PostFile from 'App/Models/PostFile'
import News from 'App/Models/News'
import { DateTime } from 'luxon'

const throwIfHasRejected = <T>(data: Array<PromiseSettledResult<T>>) => {
  const hasErrors = data.some(({ status }) => status === 'rejected')

  if (hasErrors) {
    const rejectedItems = data.filter(({ status }) => status === 'rejected') as PromiseRejectedResult[]
    const reasons = rejectedItems.map(({ reason }) => reason.message).join('\n')

    throw new Error(reasons)
  }
}

const loadNews = async () => {
  Logger.debug('Getting news')
  const { data } = await axios.get('https://cba.ifmt.edu.br/conteudo/noticias/')
  const dom = new JSDOM(data)
  const dates = Array.from(dom.window.document.querySelectorAll('div.data-local')).map(el => el.textContent)
  const newsContents = Array.from(dom.window.document.querySelectorAll('p.no-margin.espacamento-medio')).map(
    el => el.textContent,
  )
  const news: string[] = []

  for (let i = 0; i < dates.length; i++) {
    const content = dates[i]
    const newsContent = newsContents[i]

    if (!content || !newsContent) continue

    const [datePart] = content.split('-')
    const trimmedDate = datePart.trim()
    const pastDays = DateTime.fromFormat(trimmedDate, 'dd MMM', { locale: 'pt-br' }).diffNow().as('days')

    if (pastDays >= -5) {
      news.push(newsContent.trim())
    }
  }

  await News.query().whereNull('news_session_id').delete()
  await News.createMany(news.map(description => ({ description: description.trim() })))

  Logger.debug('Getting news complete')
}

const loadInstagramPosts = async () => {
  Logger.debug('Getting instagram posts')

  const path = join(__dirname, '..', '..', 'instagram_downloader.py')
  const baseDir = join(__dirname, '..', '..', 'instagram')

  await spawnAsync('python', [path])

  const existingPosts = await PostFile.query().whereNull('news_session_id')
  const deletePromises = existingPosts.map(async post => post.delete())
  await Promise.all(deletePromises)

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
      await PostFile.create({ fileId: fileInstance.id })
    })

  const settled = await Promise.allSettled(promises)
  throwIfHasRejected(settled)

  await rm(baseDir, { force: true, recursive: true })

  Logger.debug('Getting instagram posts complete')
}

export const loadData = async () => {
  Logger.debug('Starting loading all data')

  const settled = await Promise.allSettled([loadNews(), loadInstagramPosts()])
  throwIfHasRejected(settled)

  Logger.debug('All data loaded')
}
