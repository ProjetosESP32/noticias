import { Transmit } from '@adonisjs/transmit-client'

let transmit: Transmit | null = null

export const getTransmit = () => {
  if (transmit === null) {
    transmit = new Transmit({
      baseUrl: location.origin,
    })
  }

  return transmit
}
