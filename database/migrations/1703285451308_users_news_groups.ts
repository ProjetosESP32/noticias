import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Role } from 'App/Enums/Role'

export default class extends BaseSchema {
  protected tableName = 'users_news_groups'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('news_group_id').unsigned().references('id').inTable('news_groups').onDelete('CASCADE')
      table.unique(['user_id', 'news_group_id'])

      table.enum('role', Object.values(Role))

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
