import db from '@adonisjs/lucid/services/db'
import transmit from '@adonisjs/transmit/services/main'

export const broadcastClientsUpdate = async (groupId: number, message: string = 'reload') => {
  const clients = await db
    .query({ mode: 'read' })
    .select('id')
    .from('clients')
    .where('group_id', groupId)

  clients.forEach(({ id }) => {
    transmit.broadcast(`clients/${id}`, message)
  })
}
