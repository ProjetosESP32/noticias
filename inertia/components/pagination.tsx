import { Link } from '@inertiajs/react'
import type { Paginated } from '~/type/paginated'

import styles from './pagination.module.scss'

interface PaginationProps {
  metadata: Paginated<unknown>['meta']
  baseUrl: string
}

export const Pagination = ({ metadata, baseUrl }: PaginationProps) => {
  const startLink = Math.max(2, metadata.currentPage - 4)
  const endLink = Math.min(metadata.lastPage, metadata.currentPage + 4)

  const len = endLink - startLink
  const pages = Array.from({ length: Math.max(len, 0) }, (_, i) => i + startLink)

  const renderFirstEllipsis = !!pages[0] && pages[0] !== 2
  const lastPage = pages[pages.length - 1]
  const renderLastEllipsis = !!lastPage && lastPage !== metadata.lastPage - 1

  const getUrl = (page: number) => `${baseUrl}?page=${page}`

  return (
    <div className={styles.container}>
      <Link href={getUrl(1)}>1</Link>
      {renderFirstEllipsis ? <span>...</span> : null}
      {pages.map((page) => (
        <Link href={getUrl(page)}>{page}</Link>
      ))}
      {renderLastEllipsis ? <span>...</span> : null}
      {metadata.lastPage !== 1 ? (
        <Link href={getUrl(metadata.lastPage)}>{metadata.lastPage}</Link>
      ) : null}
    </div>
  )
}
