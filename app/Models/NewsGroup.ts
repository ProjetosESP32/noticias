import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeDelete, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import PostFile from './PostFile'
import NewsSession from './NewsSession'
import News from './News'

export default class NewsGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public instagramToken: string

  @column()
  public instagramDays: number

  @column()
  public vinheta: string

  @column()
  public noticiasDays: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => PostFile)
  public posts: HasMany<typeof PostFile>

  @hasMany(() => NewsSession)
  public sessions: HasMany<typeof NewsSession>

  @hasMany(() => News)
  public news: HasMany<typeof News>

  @beforeDelete()
  protected static async deleteItens(group: NewsGroup) {
    await group.load('posts')
    await Promise.all(group.posts.map(async p => p.delete()))

    await group.load('sessions')
    await Promise.all(group.sessions.map(async s => s.delete()))

    await group.load('news')
    await Promise.all(group.news.map(async n => n.delete()))
  }
}
