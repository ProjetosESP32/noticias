import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import { loadData } from 'App/Utils/load_data'
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
