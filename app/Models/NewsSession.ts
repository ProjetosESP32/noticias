import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeDelete, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import News from './News'
import PostFile from './PostFile'
import { SessionType } from 'App/Enums/SessionType'

export default class NewsSession extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: SessionType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => News)
  public news: HasMany<typeof News>

  @hasMany(() => PostFile)
  public postFiles: HasMany<typeof PostFile>

  @beforeDelete()
  protected static async deleteItens(newsSession: NewsSession) {
    await newsSession.load('news')
    await newsSession.load('postFiles')
    await Promise.all(newsSession.news.map(async news => news.delete()))
    await Promise.all(newsSession.postFiles.map(async file => file.delete()))
  }
}
