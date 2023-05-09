import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.integer('file_id').unsigned().references('id').inTable('files')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
