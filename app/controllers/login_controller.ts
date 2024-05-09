import User from '#models/user'
import { loginValidator } from '#validators/login'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async index({ inertia }: HttpContext) {
    return inertia.render('login')
  }

  async store({ auth, request, response }: HttpContext) {
    const { username, password, rememberMe } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(username, password)
    await auth.use('web').login(user, rememberMe)

    response.redirect().toRoute('groups.index')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    response.redirect('/auth')
  }
}
