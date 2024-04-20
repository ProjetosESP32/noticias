import { schema, type CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateNewsGroupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(25),
    ]),
    description: schema.string.optional({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(100),
    ]),
    instagramToken: schema.string.optional(),
    vinheta: schema.string.optional({ trim: true }, []),
    instagramDays: schema.number(),
    noticiasDays: schema.number(),
  })

  public messages: CustomMessages = {}
}
