import {
  BaseModel,
  BelongsTo,
  ModelQueryBuilderContract,
  afterDelete,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import File from './File'
import NewsSession from './NewsSession'

export default class NewsFile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public newsSessionId: number

  @column()
  public fileId: number

  @column()
  public audioEnabled: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => NewsSession)
  public newsSession: BelongsTo<typeof NewsSession>

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>

  @beforeFetch()
  @beforeFind()
  static preloadFile(query: ModelQueryBuilderContract<typeof NewsFile>) {
    void query.preload('file')
  }

  @afterDelete()
  static async destroyFile(newsFile: NewsFile) {
    await newsFile.file.delete()
  }
}
