import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'post_files'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('news_session_id').references('id').inTable('news_sessions').unsigned().nullable()
      table.json('file')
      table.json('fallback_file').nullable()
      table.boolean('audio_enabled').defaultTo(false)
      table.boolean('priority').defaultTo(false)
      table.enum('type', ['image', 'video'])

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
