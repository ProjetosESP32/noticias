import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ALLOWED_IMAGE_EXTENSIONS } from 'App/Enums/ImageExt'
import { PostFileTypes } from 'App/Enums/PostFileTypes'
import { ALLOWED_VIDEO_EXTENSIONS } from 'App/Enums/VideoExt'
import NewsGroup from 'App/Models/NewsGroup'
import { addVideoConvertTask } from 'App/Utils/add_video_convert_task'
import { getPaginationData } from 'App/Utils/request'
import CreatePostFileValidator from 'App/Validators/CreatePostFileValidator'

export default class GlobalPostsController {
  public async index({ view, params, request }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const [page, perPage] = getPaginationData(request.qs())
    const posts = await group.related('posts').query().paginate(page, perPage)
    posts.baseUrl(`/groups/${group.id}/global-posts`)

    return view.render('pages/global_posts/index', { group, posts })
  }

  public async store({ request, response, session, params }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const { audioEnabled, files, priority } = await request.validate(CreatePostFileValidator)

    const imageFiles = files.filter(file => ALLOWED_IMAGE_EXTENSIONS.includes(file.extname ?? ''))
    await group
      .related('posts')
      .createMany(imageFiles.map(file => ({ priority, type: PostFileTypes.IMAGE, file: Attachment.fromFile(file) })))

    const videoFiles = files.filter(file => ALLOWED_VIDEO_EXTENSIONS.includes(file.extname ?? ''))
    await addVideoConvertTask(group.id, null, videoFiles, audioEnabled, priority)

    session.flash('toast', {
      title: 'Sucesso!',
      description: 'Imagens adicionadas e vídeos em processamento.',
      type: 'success',
    })

    response.redirect().toRoute('groups.global_posts.index', [group.id])
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const file = await group.related('posts').query().where('id', params.id).firstOrFail()

    await file.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Arquivo removido.', type: 'success' })

    response.redirect().toRoute('groups.global_posts.index', [group.id])
  }
}
