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

    const news = await News.query().where('news_session_id', newsSession.id).orWhereNull('news_session_id')
    const posts = await PostFile.query().where('news_session_id', newsSession.id)
    const globalPosts = await PostFile.query().whereNull('news_session_id')

    return view.render('pages/news/show', { newsSession, news, posts, globalPosts })
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
