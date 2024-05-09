export const getPaginationData = (
  qs: Record<string, unknown>,
  [defaultPage, defaultPerPage] = [1, 15]
) => {
  const { page, perPage } = qs

  return [Number(page) || defaultPage, Number(perPage) || defaultPerPage]
}
