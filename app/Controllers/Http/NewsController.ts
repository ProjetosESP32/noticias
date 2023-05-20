import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'
import NewsSession from 'App/Models/NewsSession'
import PostFile from 'App/Models/PostFile'
import CreateNewsValidator from 'App/Validators/CreateNewsValidator'

export default class NewsController {
  public async index({ view }: HttpContextContract) {
    const newsSessions = await NewsSession.all()

    return view.render('pages/news/index', { newsSessions })
  }

  public async show({ view, params }: HttpContextContract) {
    const newsSession = await NewsSession.findOrFail(params.id)
    await newsSession.load('news')
    await newsSession.load('postFiles')

    let news: News[] = []
    let posts: PostFile[] = []

    const newsQuery = News.query().where('news_session_id', newsSession.id)
    const postQuery = PostFile.query().where('news_session_id', newsSession.id)

    if (newsSession.isPortalNewsActive) {
      void newsQuery.orWhereNull('news_session_id')
    }

    if (newsSession.isInstagramFilesActive) {
      void postQuery.orWhereNull('news_session_id')
    }

    news = await newsQuery
    posts = await postQuery

    return view.render('pages/news/show', { newsSession, news, posts })
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
