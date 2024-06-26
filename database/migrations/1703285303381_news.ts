import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('news_group_id').unsigned().references('id').inTable('news_groups')
      table.integer('news_session_id').unsigned().references('id').inTable('news_sessions').nullable()

      table.string('message', 255)

      table.string('automatic_generated')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
