import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsSession from 'App/Models/NewsSession'
import PortalNews from 'App/Models/PortalNews'
import CreateNewsValidator from 'App/Validators/CreateNewsValidator'

export default class NewsController {
  public async index({ view }: HttpContextContract) {
    const newsSessions = await NewsSession.all()

    return view.render('pages/news/index', { newsSessions })
  }

  public async show({ view, params }: HttpContextContract) {
    const newsSession = await NewsSession.query()
      .where('id', params.id)
      .preload('news')
      .preload('newsFiles')
      .firstOrFail()

    let portalNews: PortalNews[] = []

    if (newsSession.isPortalNewsActive) {
      portalNews = await PortalNews.all()
    }

    return view.render('pages/news/show', { newsSession, portalNews })
  }

  public async store({ request, params, response, session }: HttpContextContract) {
    const newsSession = await NewsSession.findOrFail(params.session_id)
    const data = await request.validate(CreateNewsValidator)

    await newsSession.related('news').create(data)
    session.flash('toast', { title: 'Sucesso!', description: 'Notícia criada.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const newsSession = await NewsSession.findOrFail(params.session_id)

    await newsSession.related('news').query().where('id', params.id).delete()
    session.flash('toast', { title: 'Sucesso!', description: 'Notícia removida.', type: 'success' })

    response.redirect().toRoute('sessions.edit', { id: params.session_id })
  }
}
