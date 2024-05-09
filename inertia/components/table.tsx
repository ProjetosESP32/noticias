import {
  Column as AriaColumn,
  Row as AriaRow,
  TableHeader as AriaTableHeader,
  Button,
  Cell,
  Collection,
  type ColumnProps,
  type RowProps,
  type TableHeaderProps,
  useTableOptions,
} from 'react-aria-components'
import { Checkbox } from './checkbox'

export const Column = (props: ColumnProps) => (
  <AriaColumn {...props}>
    {({ allowsSorting, sortDirection }) => (
      <>
        {props.children}
        {allowsSorting ? (
          <span aria-hidden="true" className="sort-indicator">
            {sortDirection === 'ascending' ? '▲' : '▼'}
          </span>
        ) : null}
      </>
    )}
  </AriaColumn>
)

export const TableHeader = <T extends object>({ columns, children }: TableHeaderProps<T>) => {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions()

  return (
    <AriaTableHeader>
      {allowsDragging ? <AriaColumn /> : null}
      {selectionBehavior === 'toggle' ? (
        <AriaColumn>
          {selectionMode === 'multiple' ? <Checkbox slot="selection" /> : null}
        </AriaColumn>
      ) : null}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  )
}

export const Row = <T extends object>({ id, columns, children, ...otherProps }: RowProps<T>) => {
  const { selectionBehavior, allowsDragging } = useTableOptions()

  return (
    <AriaRow id={id} {...otherProps}>
      {allowsDragging ? (
        <Cell>
          <Button slot="drag">≡</Button>
        </Cell>
      ) : null}
      {selectionBehavior === 'toggle' ? (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      ) : null}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  )
}
