import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateNewsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    message: schema.string({ trim: true, escape: true }, [
      rules.minLength(5),
      rules.maxLength(255),
    ]),
  })

  public messages: CustomMessages = {}
}
