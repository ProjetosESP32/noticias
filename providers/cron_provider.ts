import { CronService, CronTask } from '#services/cron_service'
import { fsImportAll } from '@adonisjs/core/helpers'
import type { ApplicationService } from '@adonisjs/core/types'

type Class<T> = { new (...args: any[]): T }

export default class CronProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(CronService, () => new CronService())
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    const service = await this.app.container.make(CronService)
    const itens = await fsImportAll(new URL('../app/cron_tasks', import.meta.url))
    const classes = Object.values(itens) as Class<CronTask<any, any>>[]
    for (const clas of classes) {
      const instance = await this.app.container.make(clas)
      instance.onTick = (instance.onTick as Function).bind(instance)
      service.registerTask(instance)
    }
  }

  /**
   * The application has been booted
   */
  async start() {
    const service = await this.app.container.make(CronService)
    service.startAll()
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    const service = await this.app.container.make(CronService)
    service.stopAll()
  }
}
