import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import NewsSession from './NewsSession'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public newsGroupId: number

  @column()
  public newsSessionId?: number | null

  @column()
  public message: string

  @column()
  public automaticGenerated: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => NewsSession)
  public newsSession: BelongsTo<typeof NewsSession>
}
