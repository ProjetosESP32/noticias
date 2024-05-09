import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Client from './client.js'
import File from './file.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
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
}
