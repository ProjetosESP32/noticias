import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'

export default class UserSessionsController {
  public async index({ view }: HttpContextContract) {
    return view.render('pages/login')
  }

  public async store({ auth, request, response, session }: HttpContextContract) {
    const { username, password, remember } = await request.validate(LoginValidator)

    await auth.use('web').attempt(username, password, remember)
    session.flash('toast', { title: 'Sucesso!', description: 'Login feito.', type: 'success' })

    response.redirect('/')
  }

  public async destroy({ auth, session, response }: HttpContextContract) {
    await auth.use('web').logout()
    session.flash('toast', { title: 'Sucesso!', description: 'Desconectado.', type: 'success' })

    response.redirect('/auth/login')
  }
}
