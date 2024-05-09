import Group from '#models/group'
import { createGroupValidator, updateGroupValidator } from '#validators/group'
import type { HttpContext } from '@adonisjs/core/http'
import { getPaginationData } from '../utils/request.js'

export default class GroupsController {
  async index({ inertia, request }: HttpContext) {
    const [page, perPage] = getPaginationData(request.qs())
    const groups = await Group.query().paginate(page, perPage)

    return inertia.render('groups/index', { groups: groups.serialize() })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('groups/create')
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createGroupValidator)

    await Group.create(data)

    response.redirect().toRoute('groups.index')
  }

  async show({ params, inertia }: HttpContext) {
    const data = await Group.findOrFail(params.id)
    await data.load('clients')

    return inertia.render('groups/show', { group: data.serialize() })
  }

  async edit({ params, inertia }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    await group.load('clients')

    return inertia.render('groups/edit', { group: group.serialize() })
  }

  async update({ params, request, response }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    const data = await request.validateUsing(updateGroupValidator)

    group.merge(data)
    await group.save()

    response.redirect().toRoute('groups.index')
  }

  async destroy({ params, response }: HttpContext) {
    const group = await Group.findOrFail(params.id)

    await group.delete()

    response.redirect().toRoute('groups.index')
  }
}
