import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class PreloadData extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'preload:data'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command preload instagram posts and news from portal'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const { loadData } = await import('App/Utils/load_data')

    await loadData()
  }
}
