import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsGroup from 'App/Models/NewsGroup'
import UserNewsGroup from 'App/Models/UserNewsGroup'
import { getPaginationData } from 'App/Utils/request'
import CreateNewsGroupValidator from 'App/Validators/CreateNewsGroupValidator'
import UpdateNewsGroupValidator from 'App/Validators/UpdateNewsGroupValidator'

export default class NewsGroupsController {
  public async index({ auth, request, view }: HttpContextContract) {
    const user = auth.user!

    const [page, perPage] = getPaginationData(request)
    if (user.isRoot) {
      const groups = await NewsGroup.query().paginate(page, perPage)
      groups.baseUrl('/groups')
      return view.render('pages/news_groups/index', { groups })
    }

    const groups = await user.related('newsGroups').query().paginate(page, perPage)
    groups.baseUrl('/groups')
    return view.render('pages/news_groups/index', { groups })
  }

  public async create({ bouncer, view }: HttpContextContract) {
    await bouncer.authorize('root')

    return view.render('pages/news_groups/create')
  }

  public async store({ bouncer, request, response, session }: HttpContextContract) {
    await bouncer.authorize('root')
    const data = await request.validate(CreateNewsGroupValidator)

    await NewsGroup.create(data)

    session.flash('toast', {
      title: 'Grupo criado!',
      description: 'Grupo de sessões criado!',
      type: 'success',
    })

    response.redirect().toRoute('groups.index')
  }

  public async show({ auth, request, view, params }: HttpContextContract) {
    const user = auth.user!
    const verify = await UserNewsGroup.query().where('user_id', user.id).where('news_group_id', params.id);
      if (verify.length === 0 && user.username != "admin") {
          const [page, perPage] = getPaginationData(request)
          const groups = await user.related('newsGroups').query().paginate(page, perPage)
          return view.render('pages/news_groups/index', {groups});
      }
    const group = await NewsGroup.findOrFail(params.id)
    const [page, perPage] = getPaginationData(request)
    const sessions = await group.related('sessions').query().paginate(page, perPage)
    sessions.baseUrl(`/groups/${group.id}`)

    return view.render('pages/news_groups/show', { group, sessions })
  }

  public async edit({ view, params }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.id)

    return view.render('pages/news_groups/edit', { group })
  }

  public async update({ request, params, response, session }: HttpContextContract) {
    const group = await NewsGroup.findOrFail(params.id)
    const data = await request.validate(UpdateNewsGroupValidator)

    group.merge(data)
    await group.save()

    session.flash('toast', {
      title: 'Grupo atualizado!',
      description: `Grupo de sessões atualizado com sucesso.`,
      type: 'success',
    })

    response.redirect().toRoute('groups.index')
  }

  public async destroy({ bouncer, params, response, session }: HttpContextContract) {
    await bouncer.authorize('root')

    const group = await NewsGroup.findOrFail(params.id)
    await group.delete()
    session.flash('toast', {
      title: 'Grupo atualizado!',
      description: `Grupo de sessões deletado com sucesso.`,
      type: 'success',
    })

    response.redirect().toRoute('groups.index')
  }
}
