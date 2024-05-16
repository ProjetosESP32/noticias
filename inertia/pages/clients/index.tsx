import { Head, Link } from '@inertiajs/react'
import { Cell } from 'react-aria-components'
import { TableView } from '~/components/table_view'
import type { Paginated } from '~/type/paginated'
import { Eye } from 'react-feather'

import styles from './index.module.scss'

interface SimpleClient {
  id: string
  name: string
  description: string
  groupName: string
}

interface IndexProps {
  clients: Paginated<SimpleClient>
}

const Index = ({ clients }: IndexProps) => (
  <>
    <Head title="Clientes" />
    <main className={styles.container}>
      <TableView
        backTo="/"
        data={clients.data}
        pagination={{ meta: clients.meta, baseUrl: '/clients' }}
        tableLabel="Clientes"
        title="Clientes"
        columns={[
          { id: 'id', name: 'ID', isRowHeader: true },
          { id: 'groupName', name: 'Grupo' },
          { id: 'name', name: 'Nome' },
          { id: 'description', name: 'Descrição' },
          { id: 'actions', name: 'Ações' },
        ]}
        renderCell={(item, column) => {
          if (column === 'actions') {
            return (
              <Cell className={styles.actions}>
                <Link title="Ver" href={`/clients/${item.id}`}>
                  <Eye size={20} />
                </Link>
              </Cell>
            )
          }

          return <Cell>{item[column]}</Cell>
        }}
      />
    </main>
  </>
)

export default Index
