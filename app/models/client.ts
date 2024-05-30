import { BaseModel, beforeDelete, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import File from './file.js'
import Group from './group.js'
import News from './news.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare groupId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare postTime: number

  @column()
  declare hasSound: boolean

  @column()
  declare audioUrl: string | null

  @column()
  declare showNews: boolean

  @column()
  declare showGroupNews: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Group)
  declare relatedGroup: BelongsTo<typeof Group>

  @hasMany(() => News)
  declare news: HasMany<typeof News>

  @hasMany(() => File)
  declare files: HasMany<typeof File>

  @beforeDelete()
  static async deleteFiles(client: Client) {
    await client.load('files')

    const promises = client.files.map(async (file) => file.delete())
    await Promise.all(promises)
  }
}
