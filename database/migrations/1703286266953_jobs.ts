import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jobs'

  public async up() {
    void this.schema.createTable(this.tableName, table => {
      table.increments('id')

      table.string('type', 25)
      table.json('data')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    void this.schema.dropTable(this.tableName)
  }
}
