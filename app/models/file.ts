import app from '@adonisjs/core/services/app'
import { BaseModel, beforeDelete, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { unlink } from 'node:fs/promises'

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

  @column()
  declare isImported: boolean

  @column()
  declare hasAudio: boolean

  @column()
  declare hasPriority: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeDelete()
  static async deleteStorageFile(file: File) {
    try {
      await unlink(app.makePath('uploads', file.file))
    } catch (error) {
      console.warn('Cannot remove file', error)
    }
  }
}
