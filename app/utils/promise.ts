export const throwIfHasRejected = <T>(data: Array<PromiseSettledResult<T>>) => {
  const hasErrors = data.some(({ status }) => status === 'rejected')

  if (hasErrors) {
    const rejectedItems = data.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[]
    const reasons = rejectedItems.map(({ reason }) => reason).join('\n')

    throw new Error(reasons)
  }
}
