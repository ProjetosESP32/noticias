import type { HttpContext } from '@adonisjs/core/http'
import { getPaginationData } from '../utils/request.js'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  async index({ auth, inertia, request }: HttpContext) {
    const user = auth.use('web').user!
    const [page, perPage] = getPaginationData(request.qs())
    const users = await User.query().whereNot('id', user.id).paginate(page, perPage)

    return inertia.render('users/index', { users: users.serialize() })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('users/create')
  }

  async store({ request, response }: HttpContext) {
    const newUserData = await request.validateUsing(createUserValidator)
    await User.create(newUserData)

    response.redirect().toRoute('users.index')
  }

  async edit({ params, inertia }: HttpContext) {
    const user = await User.findOrFail(params.id)

    return inertia.render('users/edit', { user: user.serialize() })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const { username, newPassword, oldPassword } = await request.validateUsing(
      updateUserValidator,
      { meta: { userId: user.id } }
    )

    if (username) {
      user.username = username
    }

    if (newPassword && oldPassword) {
      await User.verifyCredentials(user.username, oldPassword)

      user.password = newPassword
    }

    if (user.$isDirty) {
      await user.save()
    }

    response.redirect().toRoute('users.index')
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    response.redirect().toRoute('users.index')
  }
}
