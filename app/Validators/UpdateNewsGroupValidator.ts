import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateNewsGroupValidator {
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
    instagramToken: schema.string.optional({}),
  })

  public messages: CustomMessages = {}
}
