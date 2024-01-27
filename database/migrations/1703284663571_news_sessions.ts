import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news_sessions'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('news_group_id').unsigned().references('id').inTable('news_groups')

      table.string('name', 25)
      table.string('description', 100)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
