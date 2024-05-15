import Client from '#models/client'
import File from '#models/file'
import { createFileValidator } from '#validators/file'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { contentType } from 'mime-types'
import { unlink } from 'node:fs/promises'

export default class ClientFilesController {
  async store({ params, request, response }: HttpContext) {
    const client = await Client.query()
      .where('id', params.client_id)
      .where('groupId', params.group_id)
      .firstOrFail()
    const { file, hasAudio, hasPriority } = await request.validateUsing(createFileValidator)

    await file.move(app.makePath('uploads'), { name: `${cuid()}.${file.extname}` })

    await client.related('files').create({
      groupId: client.groupId,
      file: file.fileName,
      mime: contentType(file.extname!) || undefined,
      provider: 'local',
      hasAudio: file.extname!.includes('mp4') && hasAudio,
      hasPriority,
    })

    response.redirect().toRoute('groups.clients.edit', [params.group_id, params.client_id])
  }

  async destroy({ params, response }: HttpContext) {
    const file = await File.query()
      .where('id', params.id)
      .where('clientId', params.client_id)
      .where('groupId', params.group_id)
      .firstOrFail()

    try {
      await unlink(app.makePath('uploads', file.file))
    } catch (error) {
      response.internalServerError()
      return
    }

    await file.delete()

    response.redirect().toRoute('groups.clients.edit', [params.client_id, params.group_id])
  }
}