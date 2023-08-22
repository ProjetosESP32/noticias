import { schema, type CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePostFileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    files: schema.array().members(
      schema.file({
        extnames: ['png', 'jpeg', 'jpg', 'mp4'],
        size: '100mb',
      }),
    ),
    audioEnabled: schema.boolean.optional(),
    priority: schema.boolean.optional(),
  })

  public messages: CustomMessages = {}
}
