export const getPaginationData = (
  qs: Record<string, unknown>,
  [defaultPage, defaultPerPage]: [number, number] = [1, 15],
): [number, number] => {
  const { page, perPage } = qs
  const pageNum = Number(page) || defaultPage
  const perPageNum = Number(perPage) || defaultPerPage

  return [pageNum, perPageNum]
}
