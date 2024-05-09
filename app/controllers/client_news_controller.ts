import Client from '#models/client'
import News from '#models/news'
import { createMessageValidator } from '#validators/message'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientNewsController {
  private async findClient(id: number, groupId: number) {
    return Client.query().where('id', id).where('groupId', groupId).firstOrFail()
  }

  private async findNews(id: number, clientId: number, groupId: number) {
    return News.query()
      .where('id', id)
      .where('clientId', clientId)
      .where('groupId', groupId)
      .firstOrFail()
  }

  async store({ params, request, response }: HttpContext) {
    const client = await this.findClient(params.client_id, params.group_id)
    const messageData = await request.validateUsing(createMessageValidator)

    await client.related('news').create({ ...messageData, groupId: client.groupId })

    response.redirect().toRoute('groups.clients.edit', [params.group_id, params.client_id])
  }

  async update({ params, request, response }: HttpContext) {
    const news = await this.findNews(params.id, params.client_id, params.group_id)
    const messageData = await request.validateUsing(createMessageValidator)

    news.merge(messageData)
    await news.save()

    response.redirect().toRoute('groups.clients.edit', [params.group_id, params.client_id])
  }

  async destroy({ params, response }: HttpContext) {
    const news = await this.findNews(params.id, params.client_id, params.group_id)

    await news.delete()

    response.redirect().toRoute('groups.clients.edit', [params.group_id, params.client_id])
  }
}
