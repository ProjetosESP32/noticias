import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import PostFile from 'App/Models/PostFile'
import CreatePostFileValidator from 'App/Validators/CreatePostFileValidator'

export default class GlobalPostsController {
  public async index({ view }: HttpContextContract) {
    const posts = await PostFile.query().whereNull('newsSessionId')

    return view.render('pages/global_posts/index', { posts })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const { audioEnabled, files, priority } = await request.validate(CreatePostFileValidator)

    const newFiles = await File.createMany(files.map(file => ({ data: Attachment.fromFile(file) })))
    const postFiles = await PostFile.createMany(
      files.map(file => ({ audioEnabled: file.extname === 'mp4' ? audioEnabled : false, priority })),
    )
    await Promise.all(postFiles.map(async (postFile, i) => postFile.related('file').associate(newFiles[i])))

    session.flash('toast', { title: 'Sucesso!', description: 'Arquivos adicionados.', type: 'success' })

    response.redirect().toRoute('global.index')
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const file = await PostFile.findOrFail(params.id)

    await file.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo removido.', type: 'success' })

    response.redirect().toRoute('global.index')
  }
}
