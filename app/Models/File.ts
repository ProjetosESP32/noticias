import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @attachment({
    preComputeUrl: async (disk, attachment) => {
      try {
        return await disk.getUrl(attachment.name)
      } catch (e) {
        return ''
      }
    },
  })
  public data: AttachmentContract

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
