import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { generatePassword } from 'App/Utils/generate_password'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.allows('admin')
    const users = await User.query().where('username', '<>', 'admin')

    return view.render('pages/users/index', { users })
  }

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.allows('admin')
    const password = generatePassword(16)

    return view.render('pages/users/create', { password })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.allows('admin')
    const data = await request.validate(CreateUserValidator)

    await User.create(data)

    response.redirect().toRoute('users.index')
  }

  public async edit({ view, params, bouncer }: HttpContextContract) {
    await bouncer.allows('admin')
    const user = await User.findOrFail(params.id)

    return view.render('pages/users/edit', { user })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.allows('admin')
    const user = await User.findOrFail(params.id)
    const data = await request.validate(UpdateUserValidator)

    user.merge(data)
    await user.save()

    response.redirect().toRoute('users.index')
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    await bouncer.allows('admin')
    const user = await User.findOrFail(params.id)

    await user.delete()

    response.redirect().toRoute('users.index')
  }
}
