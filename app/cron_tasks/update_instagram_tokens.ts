import Group from '#models/group'
import type { CronTask } from '#services/cron_service'
import app from '@adonisjs/core/services/app'
import ky from 'ky'
import { throwIfHasRejected } from '../utils/promise.js'

interface InstagramAPIUpdateTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export default class UpdateInstagramTokens implements CronTask<null, null> {
  cronTime = '0 */24 * * *'
  runOnInit = app.inProduction
  timeZone = 'America/Cuiaba'

  onTick() {
    console.info('running update instagram tokens cron task')
    this.updateTokens()
      .then(() => {
        console.info('update instagram tokens cron task returned successfully')
      })
      .catch((e) => {
        console.warn(e, 'Error ocurred in update instagram tokens cron task')
      })
  }

  private async updateTokens() {
    const groups = await Group.query().whereNotNull('instagramToken')

    const promises = groups.map(async (group) => {
      const { access_token: acessToken } = await ky(
        'https://graph.instagram.com/refresh_access_token',
        {
          searchParams: { grant_type: 'ig_refresh_token', access_token: group.instagramToken! },
        }
      ).json<InstagramAPIUpdateTokenResponse>()

      group.instagramToken = acessToken
      await group.save()
    })

    throwIfHasRejected(await Promise.allSettled(promises))
  }
}
