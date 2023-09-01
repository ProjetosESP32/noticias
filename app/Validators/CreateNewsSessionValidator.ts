import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema, type CustomMessages } from '@ioc:Adonis/Core/Validator'
import { SessionType } from 'App/Enums/SessionType'

export default class CreateNewsSessionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(25)]),
    type: schema.enum(Object.values(SessionType)),
  })

  public messages: CustomMessages = {}
}
