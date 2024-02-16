import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsGroup from 'App/Models/NewsGroup'
import UserNewsGroup from 'App/Models/UserNewsGroup'
import NewsSession from 'App/Models/NewsSession'
import { getPaginationData } from 'App/Utils/request'
import CreateNewsSessionValidator from 'App/Validators/CreateNewsSessionValidator'
import UpdateNewsSessionValidator from 'App/Validators/UpdateNewsSessionValidator'

export default class NewsSessionsController {
  public async create({ view, params }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)

    return view.render('pages/news_sessions/create', { group })
  }

  public async store({ request, response, session, params }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const data = await request.validate(CreateNewsSessionValidator)

    await group.related('sessions').create(data)
    session.flash('toast', {
      title: 'Sessão salva!',
      description: 'Sessão de exibição de notícia salva com sucesso.',
      type: 'success',
    })

    response.redirect().toRoute('groups.show', [group.id])
  }

  public async show({ params, view }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    await group.load('posts')
    const newsSession = await group
      .related('sessions')
      .query()
      .where('id', params.id)
      .preload('news')
      .preload('postFiles')
      .firstOrFail()
    let soundtracktype = ""
    if (newsSession.soundtrack.includes("youtube")) {
    soundtracktype = "youtube"
    newsSession.soundtrack = newsSession.soundtrack.replace('https://www.youtube.com/watch?v=',"")
    }else {
        soundtracktype = "radio"
    }
    return view.render('pages/news_sessions/show', { group, newsSession, soundtracktype })
  }

  public async edit({ auth, request, params, view }: HttpContextContract) {
    const user = auth.user!
    const verify = await UserNewsGroup.query().where('user_id', user.id).where('news_group_id', params.id);
      if (verify.length === 0 && user.username != "admin") {
          const [page, perPage] = getPaginationData(request)
          const groups = await user.related('newsGroups').query().paginate(page, perPage)
          return view.render('pages/news_groups/index', {groups});
      }
    const group = await NewsGroup.findOrFail(params.group_id)
    const newsSession = await group
      .related('sessions')
      .query()
      .where('id', params.id)
      .preload('news')
      .preload('postFiles')
      .firstOrFail()
    return view.render('pages/news_sessions/edit', { group, newsSession })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const data = await request.validate(UpdateNewsSessionValidator)
    const newsSession = await NewsSession.findOrFail(params.id)

    newsSession.merge(data)
    await newsSession.save()
    session.flash('toast', {
      title: 'Sessão atualizada!',
      description: 'Sessão de exibição de notícia atualizada com sucesso.',
      type: 'success',
    })

    response.redirect().toRoute('groups.show', [group.id])
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.group_id)
    const newsSession = await group.related('sessions').query().where('id', params.id).firstOrFail()

    await newsSession.delete()
    session.flash('toast', {
      title: 'Sessão deletada!',
      description: `Sessão de exibição de notícia deletata com sucesso.`,
      type: 'success',
    })

    response.redirect().toRoute('groups.show', [group.id])
  }
}
