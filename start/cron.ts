import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import { loadData } from 'App/Utils/load_data'
import { updateInstagramApiToken } from 'App/Utils/update_instagram_api_token'
import { CronJob } from 'cron'

void new CronJob(
  '0 6,12,18 * * *',
  () => {
    Logger.info('Starting job - Sync data')
    loadData()
      .then(() => {
        Logger.info('Sync data - complete')
      })
      .catch(err => {
        Logger.error(err, 'Sync data - error')
      })
  },
  null,
  true,
  'America/Cuiaba',
  null,
  Application.inProduction,
)

void new CronJob(
  '0 */24 * * *',
  () => {
    Logger.info('Starting job - Update Instagram API token')
    updateInstagramApiToken()
      .then(() => {
        Logger.info('Update Instagram API token - complete')
      })
      .catch(err => {
        Logger.error(err, 'Update Instagram API token - error')
      })
  },
  null,
  true,
  'America/Cuiaba',
  null,
  false,
)
