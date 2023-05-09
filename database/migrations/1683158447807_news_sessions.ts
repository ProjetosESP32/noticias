import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news_sessions'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.string('name', 25)
      table.boolean('is_portal_news_active').defaultTo(false)
      table.boolean('is_instagram_files_active').defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
