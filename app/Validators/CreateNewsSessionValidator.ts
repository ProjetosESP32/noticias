import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema, type CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class CreateNewsSessionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(25)]),
  })

  public messages: CustomMessages = {}
}
