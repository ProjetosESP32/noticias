import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ALLOWED_IMAGE_EXTENSIONS } from 'App/Enums/ImageExt'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import { ALLOWED_VIDEO_EXTENSIONS } from 'App/Enums/VideoExt'
import NewsGroup from 'App/Models/NewsGroup'
import { addVideoConvertTask } from 'App/Utils/add_video_convert_task'
import CreatePostFileValidator from 'App/Validators/CreatePostFileValidator'

export default class PostFilesController {
  public async store({ request, response, params, session }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const newsSession = await group.related('sessions').query().where('id', params.session_id).firstOrFail()
    const { files, audioEnabled, priority } = await request.validate(CreatePostFileValidator)

    const imageFiles = files.filter(file => ALLOWED_IMAGE_EXTENSIONS.includes(file.extname ?? ''))
    await newsSession
      .related('postFiles')
      .createMany(imageFiles.map(file => ({ priority, type: PostFileTypes.IMAGE, file: Attachment.fromFile(file) })))

    const videoFiles = files.filter(file => ALLOWED_VIDEO_EXTENSIONS.includes(file.extname ?? ''))
    await addVideoConvertTask(group.id, newsSession.id, videoFiles, audioEnabled, priority)

    session.flash('toast', {
      title: 'Sucesso!',
      description: 'Imagens adicionadas e vídeos em processamento.',
      type: 'success',
    })

    response.redirect().toRoute('groups.sessions.edit', [group.id, newsSession.id])
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const newsSession = await group.related('sessions').query().where('id', params.session_id).firstOrFail()
    const file = await newsSession.related('postFiles').query().where('id', params.id).firstOrFail()

    await file.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo removido.', type: 'success' })

    response.redirect().toRoute('groups.sessions.edit', [group.id, newsSession.id])
  }
}
