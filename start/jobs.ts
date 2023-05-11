import { loadData } from 'App/Utils/load_data'
import { CronJob } from 'cron'

void new CronJob(
  '0 6,12,18 * * *',
  () => {
    void loadData()
  },
  null,
  true,
  'America/Cuiaba',
)
