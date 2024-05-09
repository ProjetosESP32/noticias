import { Head, Link } from '@inertiajs/react'
import { Cell, Table, TableBody } from 'react-aria-components'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import { Pagination } from '~/components/pagination'
import { Column, Row, TableHeader } from '~/components/table'
import type { Paginated } from '~/type/paginated'
import type { DefaultProps } from '~/type/props'
import type { User } from '~/type/user'
import { withComponent } from '~/utils/hoc'

import styles from './index.module.scss'

interface IndexProps {
  users: Paginated<User>
}

interface ColumnDesc {
  id: keyof User | 'actions'
  name: string
  isRowHeader?: boolean
}

const columns: ColumnDesc[] = [
  { id: 'id', name: 'ID', isRowHeader: true },
  { id: 'username', name: 'Nome' },
  { id: 'actions', name: 'Ações' },
]

const Index = ({ users }: DefaultProps<IndexProps>) => {
  const makeRenderDataCell = (item: User) => (column: ColumnDesc) => {
    if (column.id === 'actions') {
      const itemLink = `/groups/${item.id}`
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
      <Head title="Usuários" />
      <main className={styles.container}>
        <div className={styles.content}>
          <h2>Usuários</h2>
          <BackLink href="/" />
          <div className={styles.links}>
            <Link href="/users/create">Criar usuário</Link>
          </div>
          <Table aria-label="Usuários de sessões">
            <TableHeader columns={columns}>
              {(column) => <Column isRowHeader={column.isRowHeader}>{column.name}</Column>}
            </TableHeader>
            <TableBody items={users.data}>
              {(item) => <Row columns={columns}>{makeRenderDataCell(item)}</Row>}
            </TableBody>
          </Table>
          <Pagination baseUrl="/" metadata={users.meta} />
        </div>
      </main>
    </>
  )
}

export default withComponent(Index, Dashboard)
