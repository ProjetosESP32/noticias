import { Head, Link } from '@inertiajs/react'
import { Cell } from 'react-aria-components'
import { Edit2, Trash2 } from 'react-feather'
import { Dashboard } from '~/components/dashboard'
import { TableView } from '~/components/table_view'
import type { Paginated } from '~/type/paginated'
import type { DefaultProps } from '~/type/props'
import type { User } from '~/type/user'
import { withComponent } from '~/utils/hoc'

interface IndexProps {
  users: Paginated<User>
}

const Index = ({ users }: DefaultProps<IndexProps>) => (
  <>
    <Head title="Usuários" />
    <main className="full">
      <TableView
        backTo="/"
        data={users.data}
        pagination={{ meta: users.meta, baseUrl: '/users' }}
        tableLabel="Usuários"
        title="Usuários"
        links={[{ href: '/users/create', children: 'Criar usuário' }]}
        columns={[
          { id: 'id', name: 'ID', isRowHeader: true },
          { id: 'username', name: 'Nome' },
          { id: 'actions', name: 'Ações' },
        ]}
        renderCell={(item, column) => {
          if (column === 'actions') {
            const itemLink = `/users/${item.id}`
            const editItemLink = `${itemLink}/edit`

            return (
              <Cell className="default-action-cell">
                <Link title="Editar" href={editItemLink}>
                  <Edit2 size={20} />
                </Link>
                <Link
                  title="Excluir"
                  href={itemLink}
                  method="delete"
                  as="button"
                  type="button"
                  className="danger"
                >
                  <Trash2 size={20} />
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

export default withComponent(Index, Dashboard)
