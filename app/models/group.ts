import { BaseModel, beforeDelete, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Client from './client.js'
import File from './file.js'
import News from './news.js'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare instagramToken: string | null

  @column()
  declare instagramSyncDays: number | null

  @column()
  declare newsSource: string | null

  @column()
  declare newsSourceSelector: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Client)
  declare clients: HasMany<typeof Client>

  @hasMany(() => File)
  declare files: HasMany<typeof File>

  @hasMany(() => News)
  declare news: HasMany<typeof News>

  @beforeDelete()
  static async cleanup(group: Group) {
    await group.load('files')
    await group.load('clients')

    const filePromises = group.files.map(async (file) => file.delete())
    const clientPromises = group.clients.map(async (client) => client.delete())
    await Promise.all([...filePromises, ...clientPromises])
  }
}
