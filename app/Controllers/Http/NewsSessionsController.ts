import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsSession from 'App/Models/NewsSession'
import CreateNewsSessionValidator from 'App/Validators/CreateNewsSessionValidator'

export default class NewsSessionsController {
  public async index({ view }: HttpContextContract) {
    const sessions = await NewsSession.all()

    return view.render('pages/news_sessions/index', { sessions })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/news_sessions/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateNewsSessionValidator)

    await NewsSession.create(data)
    session.flash('toast', {
      title: 'Sessão salva!',
      description: 'Sessão de exibição de notícia salva com sucesso.',
      type: 'success',
    })

    response.redirect().toRoute('sessions.index')
  }

  public async show({ params, view }: HttpContextContract) {
    const newsSession = await NewsSession.query()
      .where('id', params.id)
      .preload('news')
      .preload('postFiles')
      .firstOrFail()

    return view.render('pages/news_sessions/show', { newsSession })
  }

  public async edit({ params, view }: HttpContextContract) {
    const newsSession = await NewsSession.query()
      .where('id', params.id)
      .preload('news')
      .preload('postFiles')
      .firstOrFail()

    return view.render('pages/news_sessions/edit', { newsSession })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const {
      name,
      isInstagramFilesActive = false,
      isPortalNewsActive = false,
    } = await request.validate(CreateNewsSessionValidator)
    const newsSession = await NewsSession.findOrFail(params.id)

    newsSession.merge({ name, isInstagramFilesActive, isPortalNewsActive })
    await newsSession.save()
    session.flash('toast', {
      title: 'Sessão atualizada!',
      description: 'Sessão de exibição de notícia atualiazda com sucesso.',
      type: 'success',
    })

    response.redirect().toRoute('sessions.edit', { id: params.id })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const newsSession = await NewsSession.findOrFail(params.id)

    await newsSession.delete()
    session.flash('toast', {
      title: 'Sessão deletada!',
      description: `Sessão de exibição de notícia "${newsSession.name}" deletata com sucesso.`,
      type: 'success',
    })

    response.redirect('/')
  }
}
