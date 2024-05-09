import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare groupId: number

  @column()
  declare clientId: number | null

  @column()
  declare provider: string

  @column()
  declare file: string

  @column()
  declare mime: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
