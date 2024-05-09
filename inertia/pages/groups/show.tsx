import { Head, Link } from '@inertiajs/react'
import { Cell, Table, TableBody } from 'react-aria-components'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import { Column, Row, TableHeader } from '~/components/table'
import type { Client } from '~/type/client'
import type { FullGroup } from '~/type/group'
import { withComponent } from '~/utils/hoc'
import type { DefaultProps } from '~/utils/props'

import styles from './index.module.scss'

interface ShowProps {
  group: FullGroup
}

interface ColumnDesc {
  id: keyof Client | 'actions'
  name: string
  isRowHeader?: boolean
}

const columns: ColumnDesc[] = [
  { id: 'id', name: 'ID', isRowHeader: true },
  { id: 'name', name: 'Nome' },
  { id: 'description', name: 'Descrição' },
  { id: 'actions', name: 'Ações' },
]

const Show = ({ group }: DefaultProps<ShowProps>) => {
  const makeRenderDataCell = (item: Client) => (column: ColumnDesc) => {
    if (column.id === 'actions') {
      const itemLink = `/groups/${group.id}/clients/${item.id}`
      const editItemLink = `${itemLink}/edit`

      return (
        <Cell className={styles.actions}>
          <Link href={editItemLink}>Editar</Link>
          <Link href={itemLink} method="delete" as="button">
            Excluir
          </Link>
        </Cell>
      )
    }

    return <Cell>{item[column.id]}</Cell>
  }

  return (
    <>
      <Head title={group.name} />
      <main className={styles.container}>
        <div className={styles.content}>
          <BackLink href="/" />
          <h2>Clientes do grupo {group.name}</h2>
          <div className={styles.links}>
            <Link href={`/groups/${group.id}/clients/create`}>Criar cliente</Link>
          </div>
          <Table aria-label="Grupos de sessões">
            <TableHeader columns={columns}>
              {(column) => <Column isRowHeader={column.isRowHeader}>{column.name}</Column>}
            </TableHeader>
            <TableBody items={group.clients}>
              {(item) => <Row columns={columns}>{makeRenderDataCell(item)}</Row>}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  )
}

export default withComponent(Show, Dashboard)
