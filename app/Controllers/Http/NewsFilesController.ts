import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import NewsFile from 'App/Models/NewsFile'
import NewsSession from 'App/Models/NewsSession'
import CreateNewsFileValidator from 'App/Validators/CreateNewsFileValidator'

export default class NewsFilesController {
  public async store({ request, response, params, session }: HttpContextContract) {
    const newsSession = await NewsSession.findOrFail(params.session_id)
    const { file, audioEnabled } = await request.validate(CreateNewsFileValidator)

    const newFile = await File.create({ data: Attachment.fromFile(file) })
    const newsFile = await newsSession
      .related('newsFiles')
      .create({ audioEnabled: file.extname === 'mp4' ? audioEnabled : false })
    await newsFile.related('file').associate(newFile)
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo adicionado.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const file = await NewsFile.findOrFail(params.id)

    await file.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo removido.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }
}
