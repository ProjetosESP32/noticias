import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ALLOWED_IMAGE_EXTENSIONS } from 'App/Enums/ImageExt'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import { ALLOWED_VIDEO_EXTENSIONS } from 'App/Enums/VideoExt'
import PostFile from 'App/Models/PostFile'
import { addVideoConvertTask } from 'App/Utils/add_video_convert_task'
import CreatePostFileValidator from 'App/Validators/CreatePostFileValidator'

export default class GlobalPostsController {
  public async index({ view }: HttpContextContract) {
    const posts = await PostFile.query().whereNull('newsSessionId')

    return view.render('pages/global_posts/index', { posts })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const { audioEnabled, files, priority } = await request.validate(CreatePostFileValidator)

    const imageFiles = files.filter(file => ALLOWED_IMAGE_EXTENSIONS.includes(file.extname ?? ''))
    await PostFile.createMany(
      imageFiles.map(file => ({ priority, type: PostFileTypes.IMAGE, file: Attachment.fromFile(file) })),
    )

    const videoFiles = files.filter(file => ALLOWED_VIDEO_EXTENSIONS.includes(file.extname ?? ''))
    await addVideoConvertTask(videoFiles, audioEnabled, priority)

    session.flash('toast', {
      title: 'Sucesso!',
      description: 'Imagens adicionadas e vídeos em processamento.',
      type: 'success',
    })

    response.redirect().toRoute('global.index')
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const file = await PostFile.findOrFail(params.id)

    await file.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo removido.', type: 'success' })

    response.redirect().toRoute('global.index')
  }
}
