import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('group_id').unsigned().references('id').inTable('groups').onDelete('CASCADE')

      table.string('name', 25)
      table.string('description', 100)
      table.integer('post_time')
      table.boolean('has_sound').defaultTo(false)
      table.string('audio_url').nullable()
      table.boolean('show_news').defaultTo(true)
      table.boolean('show_group_news').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
