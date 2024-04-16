import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(255),
      rules.unique({ column: 'username', table: 'users', whereNot: { id: this.ctx.params.id } }),
    ]),
    groups: schema.array().members(schema.number([rules.exists({ table: 'news_groups', column: 'id' })])),
  })

  public messages: CustomMessages = {}
}
