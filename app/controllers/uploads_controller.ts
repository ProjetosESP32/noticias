import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { normalize, sep } from 'node:path'

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

export default class UploadsController {
  async get({ request, response }: HttpContext) {
    const filePath = request.param('*').join(sep)
    const normalized = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalized)) {
      response.badRequest('Malformed path')
      return
    }

    const path = app.makePath('uploads', normalized)
    return response.download(path, true)
  }
}
