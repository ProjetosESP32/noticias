import Client from '#models/client'
import Group from '#models/group'
import { createClientValidator, updateClientValidator } from '#validators/client'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { getPaginationData } from '../utils/request.js'

export default class ClientsController {
  private async findClient(id: number, groupId: number) {
    return Client.query().where('id', id).where('groupId', groupId).firstOrFail()
  }

  async index({ inertia, request }: HttpContext) {
    const [page, perPage] = getPaginationData(request.qs())
    const clients = await db
      .query()
      .select({
        id: 'clients.id',
        name: 'clients.name',
        description: 'clients.description',
        groupName: 'groups.name',
      })
      .from('clients')
      .innerJoin('groups', 'groups.id', 'clients.group_id')
      .orderBy('clients.group_id', 'asc')
      .paginate(page, perPage)

    return inertia.render('clients/index', { clients: clients.toJSON() })
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
    const news = await db
      .query()
      .select('id', 'data')
      .from('news')
      .where('group_id', client.groupId)
    const files = await db
      .query()
      .select('id', 'provider', 'file', 'mime')
      .select({
        isImported: 'is_imported',
        hasAudio: 'has_audio',
        hasPriority: 'has_priority',
      })
      .from('files')
      .where('group_id', client.groupId)

    return inertia.render('clients/show', {
      client: client.serialize(),
      news,
      files,
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
