import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(55),
      rules.unique({ column: 'username', table: 'users' }),
    ]),
    password: schema.string({}, [rules.minLength(8)]),
    groups: schema.array().members(schema.number([rules.exists({ table: 'news_groups', column: 'id' })])),
  })

  public messages: CustomMessages = {}
}
