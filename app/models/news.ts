import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare groupId: number

  @column()
  declare clientId: number | null

  @column()
  declare data: string

  @column()
  declare isImported: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
