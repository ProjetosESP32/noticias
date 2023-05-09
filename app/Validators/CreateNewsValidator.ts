import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateNewsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    description: schema.string({ trim: true, escape: true }, [rules.maxLength(100)]),
  })

  public messages: CustomMessages = {}
}
