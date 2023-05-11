import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import NewsSession from 'App/Models/NewsSession'
import PostFile from 'App/Models/PostFile'
import CreateNewsFileValidator from 'App/Validators/CreatePostFileValidator'

export default class PostFilesController {
  public async store({ request, response, params, session }: HttpContextContract) {
    const newsSession = await NewsSession.findOrFail(params.session_id)
    const { file, audioEnabled } = await request.validate(CreateNewsFileValidator)

    const newFile = await File.create({ data: Attachment.fromFile(file) })
    const newsFile = await newsSession
      .related('postFiles')
      .create({ audioEnabled: file.extname === 'mp4' ? audioEnabled : false })
    await newsFile.related('file').associate(newFile)
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo adicionado.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const file = await PostFile.findOrFail(params.id)

    await file.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo removido.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }
}
