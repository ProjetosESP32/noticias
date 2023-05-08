import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/User'
import { generatePassword } from 'App/Utils/generate_password'

export default class extends BaseSeeder {
  public async run() {
    const password = generatePassword(18)
    await User.create({ username: 'admin', password })
    Logger.info(`Admin password: ${password}`)
  }
}
