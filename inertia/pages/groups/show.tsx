import { Head, Link } from '@inertiajs/react'
import { Cell } from 'react-aria-components'
import { Edit2, Trash2 } from 'react-feather'
import { Dashboard } from '~/components/dashboard'
import { TableView } from '~/components/table_view'
import type { FullGroup } from '~/type/group'
import type { DefaultProps } from '~/type/props'
import { withComponent } from '~/utils/hoc'

interface ShowProps {
  group: FullGroup
}

const Show = ({ group }: DefaultProps<ShowProps>) => {
  const title = `Clientes do grupo: ${group.name}`

  return (
    <>
      <Head title={group.name} />
      <main className="full">
        <TableView
          backTo="/"
          data={group.clients}
          tableLabel={title}
          title={title}
          links={[{ href: `/groups/${group.id}/clients/create`, children: 'Criar cliente' }]}
          columns={[
            { id: 'id', name: 'ID', isRowHeader: true },
            { id: 'name', name: 'Nome' },
            { id: 'description', name: 'Descrição' },
            { id: 'actions', name: 'Ações' },
          ]}
          renderCell={(item, column) => {
            if (column === 'actions') {
              const itemLink = `/groups/${group.id}/clients/${item.id}`
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
}

export default withComponent(Show, Dashboard)
