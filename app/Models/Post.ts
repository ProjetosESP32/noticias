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

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fileId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>

  @beforeFetch()
  @beforeFind()
  static preloadFile(query: ModelQueryBuilderContract<typeof Post>) {
    void query.preload('file')
  }

  @afterDelete()
  static async destroyFile(post: Post) {
    await post.file.delete()
  }
}
