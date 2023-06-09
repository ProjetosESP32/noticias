import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('news_session_id').unsigned().nullable()
      table.string('description', 255)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
