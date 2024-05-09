import Client from '#models/client'
import Group from '#models/group'
import { createClientValidator, updateClientValidator } from '#validators/client'
import type { HttpContext } from '@adonisjs/core/http'
import { getPaginationData } from '../utils/request.js'

export default class ClientsController {
  private async findClient(id: number, groupId: number) {
    return Client.query().where('id', id).where('groupId', groupId).firstOrFail()
  }

  async index({ inertia, request }: HttpContext) {
    const [page, perPage] = getPaginationData(request.qs())
    const clients = await Client.query().paginate(page, perPage)

    return inertia.render('clients/index', { clients: clients.serialize() })
  }

  async create({ inertia, params }: HttpContext) {
    const group = await Group.findOrFail(params.group_id)

    return inertia.render('groups/clients/create', { group: group.serialize() })
  }

  async store({ request, params, response }: HttpContext) {
    const group = await Group.findOrFail(params.group_id)
    const clientData = await request.validateUsing(createClientValidator)

    await group.related('clients').create(clientData)

    response.redirect().toRoute('groups.show', [group.id])
  }

  async show({ params, inertia }: HttpContext) {
    const client = await Client.findOrFail(params.id)
    await client.load('news')
    await client.load('files')
    await client.load('relatedGroup', (loader) => {
      loader.preload('news', (nLoader) => {
        nLoader.whereNull('client_id')
      })
      loader.preload('files', (fLoader) => {
        fLoader.whereNull('client_id')
      })
    })

    return inertia.render('clients/show', {
      client: client.serialize(),
    })
  }

  async edit({ params, inertia }: HttpContext) {
    const client = await this.findClient(params.id, params.group_id)
    await client.load('relatedGroup')
    await client.load('news')
    await client.load('files')

    return inertia.render('groups/clients/edit', { client: client.serialize() })
  }

  async update({ params, request, response }: HttpContext) {
    const client = await this.findClient(params.id, params.group_id)
    const data = await request.validateUsing(updateClientValidator)

    client.merge(data)
    await client.save()

    response.redirect().toRoute('groups.clients.edit', [params.group_id, params.id])
  }

  async destroy({ params, response }: HttpContext) {
    const client = await this.findClient(params.id, params.group_id)

    await client.delete()

    response.redirect().toRoute('groups.show', [params.group_id])
  }
}
