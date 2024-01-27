import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { Role } from 'App/Enums/Role'
import NewsGroup from 'App/Models/NewsGroup'
import User from 'App/Models/User'
import { generatePassword } from 'App/Utils/generate_password'
import { getPaginationData } from 'App/Utils/request'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ bouncer, view, request }: HttpContextContract) {
    await bouncer.authorize('root')
    const [page, perPage] = getPaginationData(request)

    const users = await User.query().where('isRoot', false).preload('newsGroups').paginate(page, perPage)
    users.baseUrl('/users')

    return view.render('pages/users/index', { users })
  }

  public async create({ bouncer, view }: HttpContextContract) {
    await bouncer.authorize('root')
    const password = generatePassword(12)
    const groups = await NewsGroup.all()
    const groupOptions = groups.map(g => ({ label: g.name, value: g.id }))

    return view.render('pages/users/create', { password, groupOptions })
  }

  public async store({ bouncer, request, response }: HttpContextContract) {
    await bouncer.authorize('root')
    const { groups, ...data } = await request.validate(CreateUserValidator)

    const user = await User.create(data)
    await Database.insertQuery()
      .table('users_news_groups')
      .multiInsert(groups.map(id => ({ news_group_id: id, user_id: user.id, role: Role.ADMIN })))

    response.redirect().toRoute('users.index')
  }

  public async edit({ bouncer, view, params }: HttpContextContract) {
    await bouncer.authorize('root')
    const user = await User.findOrFail(params.id)
    await user.load('newsGroups')

    const allGroups = await NewsGroup.all()
    const groupOptions = allGroups.map(g => ({
      label: g.name,
      value: g.id,
      selected: user.newsGroups.some(ug => ug.id === g.id),
    }))

    return view.render('pages/users/edit', { user, groupOptions })
  }

  public async update({ bouncer, request, response, params }: HttpContextContract) {
    await bouncer.authorize('root')
    const user = await User.findOrFail(params.id)
    const data = await request.validate(UpdateUserValidator)

    user.merge(data)
    await user.save()

    response.redirect().toRoute('users.index')
  }

  public async destroy({ bouncer, response, params }: HttpContextContract) {
    await bouncer.authorize('root')
    const user = await User.findOrFail(params.id)

    await user.delete()

    response.redirect().toRoute('users.index')
  }
}
