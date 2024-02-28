import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema, type CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class CreateNewsSessionValidator {
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
    tersound: schema.string.optional(),
    soundtrack: schema.string.optional({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(100),
    ]),
    tervinheta: schema.string.optional(),
    importarnoticias: schema.string.optional(),
  })

  public messages: CustomMessages = {}
}
