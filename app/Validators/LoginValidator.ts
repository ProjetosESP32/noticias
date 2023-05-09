import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [rules.exists({ column: 'username', table: 'users' })]),
    password: schema.string({}, [rules.minLength(6)]),
    remember: schema.boolean.optional(),
  })

  public messages: CustomMessages = {}
}
