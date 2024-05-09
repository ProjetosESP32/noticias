import { Head, Link } from '@inertiajs/react'
import { Cell, Table, TableBody } from 'react-aria-components'
import { Dashboard } from '~/components/dashboard'
import { Pagination } from '~/components/pagination'
import { Column, Row, TableHeader } from '~/components/table'
import type { Group } from '~/type/group'
import type { Paginated } from '~/type/paginated'
import { withComponent } from '~/utils/hoc'
import type { DefaultProps } from '~/type/props'

import styles from './index.module.scss'

interface GroupIndexProps {
  groups: Paginated<Group>
}

interface ColumnDesc {
  id: keyof Group | 'actions'
  name: string
  isRowHeader?: boolean
}

const columns: ColumnDesc[] = [
  { id: 'id', name: 'ID', isRowHeader: true },
  { id: 'name', name: 'Nome' },
  { id: 'description', name: 'Descrição' },
  { id: 'actions', name: 'Ações' },
]

const GroupIndex = ({ groups }: DefaultProps<GroupIndexProps>) => {
  const makeRenderDataCell = (item: Group) => (column: ColumnDesc) => {
    if (column.id === 'actions') {
      const itemLink = `/groups/${item.id}`
      const editItemLink = `${itemLink}/edit`

      return (
        <Cell className={styles.actions}>
          <Link href={itemLink}>Ver</Link>
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
      <Head title="Grupos" />
      <main className={styles.container}>
        <div className={styles.content}>
          <h2>Grupos</h2>
          <div className={styles.links}>
            <Link href="/users">Usuários</Link>
            <Link href="/clients">Clientes</Link>
            <Link href="/groups/create">Criar grupo</Link>
          </div>
          <Table aria-label="Grupos de sessões">
            <TableHeader columns={columns}>
              {(column) => <Column isRowHeader={column.isRowHeader}>{column.name}</Column>}
            </TableHeader>
            <TableBody items={groups.data}>
              {(item) => <Row columns={columns}>{makeRenderDataCell(item)}</Row>}
            </TableBody>
          </Table>
          <Pagination baseUrl="/" metadata={groups.meta} />
        </div>
      </main>
    </>
  )
}

export default withComponent(GroupIndex, Dashboard)
