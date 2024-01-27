import type { RequestContract } from '@ioc:Adonis/Core/Request'

export const getPaginationData = (
  req: RequestContract,
  [defaultPage, defaultPerPage]: [number, number] = [1, 15],
): [number, number] => {
  const { page, perPage } = req.qs()
  const pageNum = Number(page) || defaultPage
  const perPageNum = Number(perPage) || defaultPerPage

  return [pageNum, perPageNum]
}
