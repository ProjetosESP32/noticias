import { type InertiaLinkProps, Link } from '@inertiajs/react'
import { Table, TableBody } from 'react-aria-components'
import { Column, Row, TableHeader } from './table'
import { Pagination } from './pagination'
import { Paginated } from '~/type/paginated'

import styles from './table_view.module.scss'
import { BackLink } from './back_link'

interface TableViewProps<T extends object, K extends keyof T | string> {
  data: T[]
  pagination?: {
    meta: Paginated<T>['meta']
    baseUrl: string
  }
  columns: {
    id: K
    name: string
    isRowHeader?: boolean
  }[]
  title: string
  tableLabel: string
  backTo?: string
  links?: Omit<InertiaLinkProps, 'key'>[]
  renderCell: (item: T, column: K) => React.ReactElement
}

export function TableView<T extends object, K extends keyof T | string>({
  data,
  pagination,
  columns,
  title,
  tableLabel,
  backTo,
  links = [],
  renderCell,
}: TableViewProps<T, K>) {
  return (
    <div className={styles.container}>
      {backTo && backTo.length > 0 ? <BackLink href={backTo} /> : null}
      <h2>{title}</h2>
      {links.length > 0 ? (
        <div className={styles.links}>
          {links.map((p, i) => (
            <Link key={`l${i}`} {...p} />
          ))}
        </div>
      ) : null}
      <Table aria-label={tableLabel}>
        <TableHeader columns={columns}>
          {(column) => <Column isRowHeader={column.isRowHeader}>{column.name}</Column>}
        </TableHeader>
        <TableBody items={data}>
          {(item) => <Row columns={columns}>{(col) => renderCell(item, col.id)}</Row>}
        </TableBody>
      </Table>
      {pagination ? <Pagination baseUrl={pagination.baseUrl} metadata={pagination.meta} /> : null}
    </div>
  )
}
