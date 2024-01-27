import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsGroup from 'App/Models/NewsGroup'
import CreateNewsValidator from 'App/Validators/CreateNewsValidator'

export default class NewsController {
  public async store({ request, params, response, session }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const newsSession = await group.related('sessions').query().where('id', params.session_id).firstOrFail()
    const data = await request.validate(CreateNewsValidator)

    await newsSession.related('news').create(data)
    session.flash('toast', { title: 'Sucesso!', description: 'Notícia criada.', type: 'success' })

    response.redirect().toRoute('groups.sessions.edit', [group.id, newsSession.id])
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const newsSession = await group.related('sessions').query().where('id', params.session_id).firstOrFail()
    const news = await newsSession.related('news').query().where('id', params.id).firstOrFail()

    await news.delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Notícia removida.', type: 'success' })

    response.redirect().toRoute('groups.sessions.edit', [group.id, newsSession.id])
  }
}
