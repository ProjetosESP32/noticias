import Client from '#models/client'
import File from '#models/file'
import { createFilesValidator } from '#validators/file'
import { type MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'

const getMimeByExt = (extname: string) => {
  if (extname.includes('mp4')) return 'video/mp4'
  if (extname.includes('png')) return 'image/png'
  if (extname.includes('jpg') || extname.includes('jpeg')) return 'image/jpg'

  return 'unknown'
}

export default class ClientFilesController {
  async store({ params, request, response }: HttpContext) {
    const client = await Client.query()
      .where('id', params.client_id)
      .where('groupId', params.group_id)
      .firstOrFail()
    const { files } = await request.validateUsing(createFilesValidator)

    const settled = await Promise.allSettled(
      files.map(async (file) => {
        await file.move(app.makePath('uploads'), { name: `${cuid()}.${file.extname}` })
        return file
      })
    )

    const errors = settled.filter(({ status }) => status === 'rejected')
    const resolved = settled.filter(
      ({ status }) => status === 'fulfilled'
    ) as PromiseFulfilledResult<MultipartFile>[]
    if (errors.length > 0) {
      await Promise.all(resolved.map(async ({ value: file }) => unlink(file.filePath!))).catch(
        () => {} // noop, just ignore any error
      )

      response.internalServerError()
      return
    }

    await client.related('files').createMany(
      resolved.map(({ value: file }) => ({
        groupId: client.groupId,
        file: file.fileName,
        mime: getMimeByExt(file.extname!),
        provider: 'local',
      }))
    )

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
