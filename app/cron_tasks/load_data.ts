import File from '#models/file'
import Group from '#models/group'
import News from '#models/news'
import type { CronTask } from '#services/cron_service'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { JSDOM } from 'jsdom'
import ky from 'ky'
import { DateTime } from 'luxon'
import { extension } from 'mime-types'
import { writeFile } from 'node:fs/promises'
import { logRejected } from '../utils/promise.js'
import { broadcastClientsUpdate } from '../utils/sse.js'

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

export default class LoadData implements CronTask<null, null> {
  cronTime = '0 6,12,18 * * *'
  runOnInit = app.inProduction
  timeZone = 'America/Cuiaba'

  onTick() {
    console.info('running load data cron task')
    this.load()
      .then(() => {
        console.info('load data cron task returned successfully')
      })
      .catch((e) => {
        console.warn('Error ocurred in load data cron task', e)
      })
  }

  private async load() {
    const settled = await Promise.allSettled([this.loadNews(), this.loadInstagramPosts()])
    logRejected(settled)

    const numbers = (
      settled.filter(({ status }) => status === 'fulfilled') as PromiseFulfilledResult<number[]>[]
    ).flatMap(({ value }) => value)
    const groupIds = new Set(numbers)

    const broadcastPromises = [...groupIds].map(async (groupId) => broadcastClientsUpdate(groupId))
    logRejected(await Promise.allSettled(broadcastPromises))
  }

  private async loadNews() {
    const groups = await Group.query().whereNotNull('newsSource').whereNotNull('newsSourceSelector')

    const promises = groups.map(async (group) => {
      await News.query()
        .where('groupId', group.id)
        .where('isImported', true)
        .whereNull('clientId')
        .delete()

      const htmlResponse = await ky
        .get(group.newsSource!, { headers: { Accept: 'text/html' } })
        .text()
      const dom = new JSDOM(htmlResponse)
      const news = Array.from(dom.window.document.querySelectorAll(group.newsSourceSelector!))
        .map((node) => node.textContent)
        .filter((text) => text && text.length > 0)
        .map((text) => text!.trim())

      await group.related('news').createMany(news.map((text) => ({ isImported: true, data: text })))
      return group.id
    })

    const settled = await Promise.allSettled(promises)
    logRejected(settled)

    return (
      settled.filter(({ status }) => status === 'fulfilled') as PromiseFulfilledResult<number>[]
    ).map(({ value }) => value)
  }

  private async loadInstagramPosts() {
    const groups = await Group.query().whereNotNull('instagramToken')

    const promises = groups.map(async (group) => {
      const files = await File.query()
        .where('groupId', group.id)
        .where('isImported', true)
        .whereNull('clientId')

      const deleteFilePromises = files.map(async (file) => file.delete())
      const deleteFileSettled = await Promise.allSettled(deleteFilePromises)
      logRejected(deleteFileSettled)

      const { data } = await ky('https://graph.instagram.com/me/media', {
        searchParams: {
          access_token: group.instagramToken!,
          fields: ['media_url', 'media_type'].join(','),
          since: DateTime.now().minus({ days: group.instagramSyncDays! }).toISO(),
        },
      }).json<InstagramAPIResponse>()

      const savePromises = data
        .filter(({ media_type }) => media_type !== InstagramMedia.CAROUSEL_ALBUM)
        .map(async ({ media_url }) => {
          const mediaResp = await ky(media_url)

          const mime = mediaResp.headers.get('Content-Type')
          const extname = (mime && extension(mime)) || ''

          const filename = `${cuid()}.${extname}`
          const path = app.makePath('uploads', filename)
          await writeFile(path, mediaResp.body! as any) // I grant, this is a stream
          group
            .related('files')
            .create({ file: filename, isImported: true, mime: mime ?? '', provider: 'local' })
        })

      const saveSettled = await Promise.allSettled(savePromises)
      logRejected(saveSettled)

      return group.id
    })

    const settled = await Promise.allSettled(promises)
    logRejected(settled)

    return (
      settled.filter(({ status }) => status === 'fulfilled') as PromiseFulfilledResult<number>[]
    ).map(({ value }) => value)
  }
}
