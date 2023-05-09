import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeDelete, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import News from './News'
import NewsFile from './NewsFile'

export default class NewsSession extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isPortalNewsActive: boolean

  @column()
  public isInstagramFilesActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => News)
  public news: HasMany<typeof News>

  @hasMany(() => NewsFile)
  public newsFiles: HasMany<typeof NewsFile>

  @beforeDelete()
  static async deleteItens(newsSession: NewsSession) {
    await newsSession.load('news')
    await newsSession.load('newsFiles')
    await Promise.all(newsSession.news.map(async news => news.delete()))
    await Promise.all(newsSession.newsFiles.map(async file => file.delete()))
  }
}
