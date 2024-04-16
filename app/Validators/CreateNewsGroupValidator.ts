import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { type CustomMessages, schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateNewsGroupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(25),
      rules.alphaNum({ allow: ['space'] }),
    ]),
    description: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(100),
      rules.alphaNum({ allow: ['space'] }),
    ]),
    vinheta: schema.string({ trim: true }, []),
    instagramToken: schema.string.optional({}),
    instagramDays: schema.number(),
  })

  public messages: CustomMessages = {}
}
