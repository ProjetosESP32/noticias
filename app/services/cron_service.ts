import { CronJob, type CronOnCompleteCommand } from 'cron'

export type CronTask<OC extends CronOnCompleteCommand | null, C> = Omit<
  Parameters<typeof CronJob.from<OC, C>>[0],
  'start'
>

export class CronService {
  private jobs: CronJob[] = []

  registerTask<OC extends CronOnCompleteCommand, C>(cronTask: CronTask<OC, C>) {
    this.jobs.push(CronJob.from(cronTask as any))
  }

  startAll() {
    this.jobs.forEach((job) => {
      job.start()
    })
  }

  stopAll() {
    this.jobs.forEach((job) => {
      job.stop()
    })
  }
}
