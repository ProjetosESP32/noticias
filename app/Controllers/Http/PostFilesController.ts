import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import NewsSession from 'App/Models/NewsSession'
import PostFile from 'App/Models/PostFile'
import CreatePostFileValidator from 'App/Validators/CreatePostFileValidator'

export default class PostFilesController {
  public async store({ request, response, params, session }: HttpContextContract) {
    const newsSession = await NewsSession.findOrFail(params.session_id)
    const { files, audioEnabled, priority } = await request.validate(CreatePostFileValidator)

    const newFiles = await File.createMany(files.map(file => ({ data: Attachment.fromFile(file) })))
    const newsFiles = await newsSession
      .related('postFiles')
      .createMany(files.map(file => ({ audioEnabled: file.extname === 'mp4' ? audioEnabled : false, priority })))
    await Promise.all(newsFiles.map(async (newsFile, i) => newsFile.related('file').associate(newFiles[i])))
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivos adicionados.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const file = await PostFile.findOrFail(params.id)

    await file.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo removido.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }
}
