import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news_files'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('news_session_id').unsigned().references('id').inTable('news_sessions').onDelete('CASCADE')
      table.integer('file_id').unsigned().references('id').inTable('files').onDelete('CASCADE')
      table.boolean('audio_enabled').defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
