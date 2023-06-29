import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.minLength(8),
      rules.maxLength(255),
      rules.unique({ column: 'username', table: 'users' }),
    ]),
    password: schema.string({}, [rules.minLength(8)]),
  })

  public messages: CustomMessages = {}
}
