import { Head, Link } from '@inertiajs/react'
import { Cell, Table, TableBody } from 'react-aria-components'
import { Pagination } from '~/components/pagination'
import { Column, Row, TableHeader } from '~/components/table'
import type { Paginated } from '~/type/paginated'

import styles from './index.module.scss'
import { BackLink } from '~/components/back_link'

interface SimpleClient {
  id: string
  name: string
  description: string
  groupName: string
}

interface IndexProps {
  clients: Paginated<SimpleClient>
}

interface ColumnDesc {
  id: keyof SimpleClient | 'actions'
  name: string
  isRowHeader?: boolean
}

const columns: ColumnDesc[] = [
  { id: 'id', name: 'ID', isRowHeader: true },
  { id: 'groupName', name: 'Grupo' },
  { id: 'name', name: 'Nome' },
  { id: 'description', name: 'Descrição' },
  { id: 'actions', name: 'Ações' },
]

const Index = ({ clients }: IndexProps) => {
  const makeRenderDataCell = (item: SimpleClient) => (column: ColumnDesc) => {
    if (column.id === 'actions') {
      const itemLink = `/clients/${item.id}`

      return (
        <Cell>
          <Link href={itemLink}>Ver</Link>
        </Cell>
      )
    }

    return <Cell>{item[column.id]}</Cell>
  }

  return (
    <>
      <Head title="Clientes" />
      <main className={styles.container}>
        <div>
          <BackLink href="/" />
          <h2>Clientes</h2>
          <p>Selecione um cliente para a tela de visualização</p>
          <Table aria-label="Clientes">
            <TableHeader columns={columns}>
              {(column) => <Column isRowHeader={column.isRowHeader}>{column.name}</Column>}
            </TableHeader>
            <TableBody items={clients.data}>
              {(item) => <Row columns={columns}>{makeRenderDataCell(item)}</Row>}
            </TableBody>
          </Table>
          <Pagination baseUrl="/clients" metadata={clients.meta} />
        </div>
      </main>
    </>
  )
}

export default Index
