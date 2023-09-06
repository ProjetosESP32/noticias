import { Queue } from './queue'

type JobWorker<T> = (item: T) => Promise<void>
type JobRejectionHandler = (err: unknown) => void

const noop = () => {}

export class JobQueue<T> {
  private readonly queue = new Queue<T>()
  private readonly boundHandler = this.handler.bind(this)

  private running = false

  constructor(private readonly worker: JobWorker<T>, private readonly rejectionHandler: JobRejectionHandler = noop) {}

  public enqueue(item: T) {
    this.queue.enqueue(item)

    if (!this.running) this.handler()
  }

  private handler() {
    const job = this.queue.dequeue()

    if (typeof job === 'undefined') {
      this.running = false
      return
    }

    this.running = true
    this.worker(job).catch(this.rejectionHandler).finally(this.boundHandler)
  }
}
