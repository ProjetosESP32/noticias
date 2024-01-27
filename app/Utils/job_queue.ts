import Job from 'App/Models/Job'

type JobWorker<T> = (item: T) => Promise<void>
type JobRejectionHandler = (err: unknown) => void

const noop = () => {}

export class JobQueue<T extends Record<string, unknown>> {
  private readonly boundHandler = this.handler.bind(this)

  private hasJobRunning = false
  private hasJobInDB = true // to startup

  constructor(
    private readonly jobName: string,
    private readonly worker: JobWorker<T>,
    private readonly rejectionHandler: JobRejectionHandler = noop,
  ) {
    this.handler()
  }

  public async enqueue(item: T) {
    await Job.create({ type: this.jobName, data: item })
    this.hasJobInDB = true

    this.handler()
  }

  public async enqueueAll(items: T[]) {
    await Job.createMany(items.map(data => ({ type: this.jobName, data })))
    this.hasJobInDB = true

    this.handler()
  }

  private handler() {
    if (!this.hasJobInDB || this.hasJobRunning) {
      return
    }

    ;(async () => {
      const job = await Job.query().where('type', this.jobName).first()

      if (job === null) {
        this.hasJobInDB = false
        return
      }

      this.hasJobRunning = true
      await this.worker(job.data as T)
      this.hasJobRunning = false
      await job.delete()
    })()
      .catch(this.rejectionHandler)
      .finally(this.boundHandler)
  }
}
