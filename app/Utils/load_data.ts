import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import AppConfig from 'App/Models/AppConfig'
import News from 'App/Models/News'
import PostFile from 'App/Models/PostFile'
import { videoConvertQueue } from 'App/Tasks/video_convert'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'
import { extension } from 'mime-types'
import { writeFile } from 'node:fs/promises'

enum InstagramMedia {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CAROUSEL_ALBUM = 'CAROUSEL_ALBUM',
}

interface InstagramData {
  id: string
  media_url: string
  media_type: InstagramMedia
  timestamp: string
}

interface InstagramAPIResponse {
  data: InstagramData[]
  paging: {
    cursors: {
      before: string
      after: string
    }
    next: string
  }
}

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
  const { data } = await axios.get('https://cba.ifmt.edu.br/conteudo/noticias/', { headers: { Accept: 'text/html' } })
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

  const appToken = await AppConfig.findByOrFail('key', 'instagram_token')
  const postsToDelete = await PostFile.query().whereNotNull('extra')
  const instagramPostsToDelete = postsToDelete
    .filter(p => p.extra.from === 'instagram')
    .filter(p => DateTime.fromISO(p.extra.timestamp).diffNow().as('days') < -5)

  await Promise.all(instagramPostsToDelete.map(async p => p.delete()))

  const posts = await PostFile.query().whereNotNull('extra')
  const instagramPosts = posts.filter(p => p.extra.from === 'instagram')

  const {
    data: { data },
  } = await axios.get<InstagramAPIResponse>('https://graph.instagram.com/me/media', {
    params: {
      access_token: appToken.value,
      fields: ['media_url', 'media_type', 'id', 'timestamp'].join(','),
      since: DateTime.now().minus({ days: 5 }).toISO(),
    },
  })

  const promises = data
    .filter(({ id }) => !instagramPosts.some(p => p.extra.id === id))
    .filter(({ media_type: mediaType }) => mediaType !== InstagramMedia.CAROUSEL_ALBUM)
    .map(async ({ id, timestamp, media_url: mediaUrl, media_type: mediaType }) => {
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'stream' })
      const extra = { id, timestamp, from: 'instagram' }

      if (mediaType === InstagramMedia.IMAGE) {
        const mimeType = String(mediaResponse.headers['content-type'])
        const extname = extension(mimeType) || ''
        const filename = `${cuid()}.${extname}`
        await Drive.putStream(filename, mediaResponse.data)
        const stats = await Drive.getStats(filename)

        const fileAttachment = new Attachment({ extname, mimeType, size: stats.size, name: filename })
        fileAttachment.isPersisted = true

        await PostFile.create({
          file: fileAttachment,
          type: PostFileTypes.IMAGE,
          extra,
        })
        return
      }

      const folderProcessPath = Application.tmpPath('convert')
      const filePath = Application.tmpPath('convert', cuid())
      await writeFile(filePath, mediaResponse.data)

      videoConvertQueue.enqueue({ filePath, folderProcessPath, audioEnabled: false, priority: false, extra })
    })

  const settled = await Promise.allSettled(promises)
  throwIfHasRejected(settled)

  Logger.debug('Getting instagram posts complete')
}

export const loadData = async () => {
  Logger.debug('Starting loading all data')

  const settled = await Promise.allSettled([loadNews(), loadInstagramPosts()])
  throwIfHasRejected(settled)

  Logger.debug('All data loaded')
}
