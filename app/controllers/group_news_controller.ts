import Group from '#models/group'
import News from '#models/news'
import { createNewsValidator } from '#validators/message'
import type { HttpContext } from '@adonisjs/core/http'

export default class GroupNewsController {
  async store({ params, request, response }: HttpContext) {
    const group = await Group.findOrFail(params.group_id)
    const newsData = await request.validateUsing(createNewsValidator)

    await group.related('news').create(newsData)

    response.redirect().toRoute('groups.edit', [params.group_id])
  }

  async destroy({ params, response }: HttpContext) {
    const news = await News.query().where('id', params.id).where(params.group_id).firstOrFail()

    await news.delete()

    response.redirect().toRoute('groups.edit', [params.group_id])
  }
}
