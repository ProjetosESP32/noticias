import { Head, Link } from '@inertiajs/react'
import { Cell } from 'react-aria-components'
import { Edit, Eye, Trash2 } from 'react-feather'
import { Dashboard } from '~/components/dashboard'
import { TableView } from '~/components/table_view'
import type { Group } from '~/type/group'
import type { Paginated } from '~/type/paginated'
import type { DefaultProps } from '~/type/props'
import { withComponent } from '~/utils/hoc'

interface GroupIndexProps {
  groups: Paginated<Group>
}

const GroupIndex = ({ groups }: DefaultProps<GroupIndexProps>) => (
  <>
    <Head title="Grupos" />
    <main className="full">
      <TableView
        data={groups.data}
        pagination={{ meta: groups.meta, baseUrl: '/' }}
        tableLabel="Grupos de sessões"
        title="Grupos"
        links={[
          { href: '/users', children: 'Usuários' },
          { href: '/clients', children: 'Clientes' },
          { href: '/groups/create', children: 'Criar grupo' },
        ]}
        columns={[
          { id: 'id', name: 'ID', isRowHeader: true },
          { id: 'name', name: 'Nome' },
          { id: 'description', name: 'Descrição' },
          { id: 'actions', name: 'Ações' },
        ]}
        renderCell={(item, column) => {
          if (column === 'actions') {
            const itemLink = `/groups/${item.id}`
            const editItemLink = `${itemLink}/edit`

            return (
              <Cell className="default-action-cell">
                <Link title="Ver" href={itemLink}>
                  <Eye size={20} />
                </Link>
                <Link title="Editar" href={editItemLink}>
                  <Edit size={20} />
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

export default withComponent(GroupIndex, Dashboard)
