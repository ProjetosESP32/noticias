import logger from '@adonisjs/core/services/logger'

export const logRejected = <T>(data: Array<PromiseSettledResult<T>>) => {
  const hasErrors = data.some(({ status }) => status === 'rejected')

  if (hasErrors) {
    const rejectedItems = data.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[]

    rejectedItems.forEach(({ reason }) => logger.warn(reason))
  }
}
