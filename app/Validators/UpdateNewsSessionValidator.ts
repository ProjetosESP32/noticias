import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { type CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateNewsSessionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(25),
      rules.alphaNum({ allow: ['space'] }),
    ]),
    description: schema.string.optional({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(100),
      rules.alphaNum({ allow: ['space'] }),
    ]),
  })

  public messages: CustomMessages = {}
}
