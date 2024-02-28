import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import News from 'App/Models/News'
import NewsGroup from 'App/Models/NewsGroup'
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
  const groups = await NewsGroup.query()
  await News.query().whereNotNull('automatic_generated').delete();
  for (var grupo of groups) {
    if (grupo.vinheta != null && grupo.vinheta != "") {
      const { data } = await axios.get(grupo.vinheta, { headers: { Accept: 'text/html' } })
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
      var noticias = news.map(message => ({ message }));
      for (var n = 0; n < noticias.length; n++) {
          noticias[n]["news_group_id"] = grupo.id;
          noticias[n]["automatic_generated"] = "true";
      }
      await News.createMany(noticias);

      Logger.debug('Getting news complete')
    }
  }
  
}

const loadInstagramPosts = async () => {
  Logger.debug('Getting instagram posts')

  const groups = await NewsGroup.query().whereNotNull('instagram_token')

  const promises = groups.map(async group => {
    const groupDefaultPosts = await group.related('posts').query().whereNull('newsSessionId')
    const instagramPostsToDelete = groupDefaultPosts
      .filter(p => p.extra.from === 'instagram')
      .filter(
        p =>
          DateTime.fromISO(p.extra.timestamp as string)
            .diffNow()
            .as('days') < -5,
      )

    await Promise.all(instagramPostsToDelete.map(async p => p.delete()))

    const remainPosts = groupDefaultPosts.filter(p => !p.$isDeleted)

    const {
      data: { data },
    } = await axios.get<InstagramAPIResponse>('https://graph.instagram.com/me/media', {
      params: {
        access_token: group.instagramToken,
        fields: ['media_url', 'media_type', 'id', 'timestamp'].join(','),
        since: DateTime.now().minus({ days: 5 }).toISO(),
      },
    })

    const settled = await Promise.allSettled(
      data
        .filter(({ id }) => !remainPosts.some(p => p.extra.id === id))
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

            await group.related('posts').create({
              file: fileAttachment,
              type: PostFileTypes.IMAGE,
              extra,
            })
            return
          }

          const folderProcessPath = Application.tmpPath('convert')
          const filePath = Application.tmpPath('convert', cuid())
          await writeFile(filePath, mediaResponse.data)

          await videoConvertQueue.enqueue({
            sessionId: null,
            groupId: group.id,
            filePath,
            folderProcessPath,
            audioEnabled: false,
            priority: false,
            extra,
          })
        }),
    )

    throwIfHasRejected(settled)
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
