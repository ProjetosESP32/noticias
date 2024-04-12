import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import { DateTime } from 'luxon'
import NewsSession from './NewsSession'

const preComputeUrl = async (disk, attachment) => {
  try {
    return await disk.getUrl(attachment.name)
  } catch (e) {
    return ''
  }
}

export default class PostFile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public newsGroupId: number

  @column()
  public newsSessionId?: number | null

  @column()
  public type: PostFileTypes

  @column()
  public audioEnabled: boolean

  @column()
  public priority: boolean

  @attachment({ preComputeUrl })
  public file: AttachmentContract

  @column()
  public extra: Record<string, unknown>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => NewsSession)
  public newsSession: BelongsTo<typeof NewsSession>
}
