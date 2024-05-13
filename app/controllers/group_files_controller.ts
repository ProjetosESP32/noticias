import File from '#models/file'
import Group from '#models/group'
import { createFileValidator } from '#validators/file'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { contentType } from 'mime-types'

export default class GroupFilesController {
  async store({ params, request, response }: HttpContext) {
    const group = await Group.findOrFail(params.client_id)
    const { file, hasAudio, hasPriority } = await request.validateUsing(createFileValidator)

    await file.move(app.makePath('uploads'), { name: `${cuid()}.${file.extname}` })

    await group.related('files').create({
      file: file.fileName,
      mime: contentType(file.extname!) || undefined,
      provider: 'local',
      hasAudio: file.extname!.includes('mp4') && hasAudio,
      hasPriority,
    })

    response.redirect().toRoute('groups.edit', [params.group_id])
  }

  async destroy({ params, response }: HttpContext) {
    const file = await File.query()
      .where('group_id', params.group_id)
      .where('id', params.id)
      .firstOrFail()

    await file.delete()

    response.redirect().toRoute('groups.edit', [params.group_id])
  }
}
