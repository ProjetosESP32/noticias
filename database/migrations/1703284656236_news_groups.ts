import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news_groups'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')

      table.string('name', 25)
      table.string('description', 100)
      table.string('vinheta')
      table.string('instagram_token').nullable()
      table.integer('instagram_days').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
