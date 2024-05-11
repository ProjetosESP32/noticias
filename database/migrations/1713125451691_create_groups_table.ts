import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 25).unique()
      table.string('description', 100)
      table.string('instagram_token').nullable()
      table.integer('instagram_sync_days').nullable()
      table.string('news_source').nullable()
      table.string('news_source_selector').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
