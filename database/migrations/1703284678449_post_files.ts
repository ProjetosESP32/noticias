import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PostFileTypes } from 'App/Enums/PostFileTypes'

export default class extends BaseSchema {
  protected tableName = 'post_files'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('news_group_id').unsigned().references('id').inTable('news_groups')
      table.integer('news_session_id').unsigned().references('id').inTable('news_sessions').nullable()

      table.enum('type', Object.values(PostFileTypes))
      table.boolean('audio_enabled').defaultTo(false)
      table.boolean('priority').defaultTo(false)

      table.json('file')
      table.json('extra').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
