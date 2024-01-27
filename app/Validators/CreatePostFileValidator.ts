import { schema, type CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ALLOWED_IMAGE_EXTENSIONS } from 'App/Enums/ImageExt'
import { ALLOWED_VIDEO_EXTENSIONS } from 'App/Enums/VideoExt'

export default class CreatePostFileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    files: schema.array().members(
      schema.file({
        extnames: [...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS],
        size: '100mb',
      }),
    ),
    audioEnabled: schema.boolean.optional(),
    priority: schema.boolean.optional(),
  })

  public messages: CustomMessages = {}
}
