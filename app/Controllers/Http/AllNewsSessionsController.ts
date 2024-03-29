import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsGroup from 'App/Models/NewsGroup'
import { getPaginationData } from 'App/Utils/request'

export default class AllNewsSessionsController {
  public async index({ view, request }: HttpContextContract) {
    const [page, perPage] = getPaginationData(request.qs())

    const groups = await NewsGroup.query().preload('sessions').paginate(page, perPage)
    groups.baseUrl('/all-sessions')

    return view.render('pages/all-sessions', { groups })
  }
}
