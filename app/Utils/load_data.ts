import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import File from 'App/Models/File'
import News from 'App/Models/News'
import PostFile from 'App/Models/PostFile'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'
import * as mime from 'mime-types'
import { createReadStream } from 'node:fs'
import { readdir, rm, stat } from 'node:fs/promises'
import { extname, join, parse } from 'node:path'
import { spawnAsync } from './spawn_async'

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
  const news = Array.from(dom.window.document.querySelectorAll('div.small-12.columns.borda-esquerda'))
    .map(el => ({
      date: el.children.item(0)?.textContent ?? '',
      news: el.children.item(1)?.textContent ?? '',
    }))
    .filter(({ date }) => {
      const [datePart] = date.split('-')
      const trimmedDate = datePart.trim()
      const pastDays = DateTime.fromFormat(trimmedDate, 'dd MMM', { locale: 'pt-br' }).diffNow().as('days')

      return pastDays >= -5
    })
    .map(({ news: n }) => n.trim())

  await News.query().whereNull('news_session_id').delete()
  await News.createMany(news.map(description => ({ description })))

  Logger.debug('Getting news complete')
}

const loadInstagramPosts = async () => {
  Logger.debug('Getting instagram posts')

  const instagramScriptPath = join(__dirname, '..', '..', 'instagram_downloader.py')
  await spawnAsync('python3', [instagramScriptPath])

  const baseDir = join(__dirname, '..', '..', 'instagram')
  const existingPosts = await PostFile.query().whereNull('news_session_id')
  const deletePromises = existingPosts.map(async post => post.delete())
  await Promise.all(deletePromises)

  const dir = await readdir(baseDir)
  const promises = dir
    .filter((path, _i, arr) => {
      const mimeType = mime.lookup(path)

      if (mimeType && (mimeType.includes('image') || mimeType.includes('video'))) {
        if (mimeType.includes('image')) {
          const { name } = parse(path)

          const hasSimilarNameAsVideo = arr
            .filter(p => parse(p).name === name)
            .some(p => {
              const type = mime.lookup(p)
              // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
              return type && type.includes('video')
            })

          return !hasSimilarNameAsVideo
        }

        return true
      }

      return false
    })
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
