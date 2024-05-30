import Client from '#models/client'
import transmit from '@adonisjs/transmit/services/main'

transmit.authorizeChannel<{ id: string }>('clients/:id', async (_ctx, { id }) => {
  await Client.findOrFail(id)
  return true
})
