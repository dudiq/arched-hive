import { ComponentChildren } from 'preact'
import { ListContainer, ListRow } from './list-styles'
import { ListCell } from './list-cell'

type Props = {
  children: ComponentChildren
}

export function List({ children }: Props) {
  return <ListContainer>{children}</ListContainer>
}

List.Row = ListRow
List.Cell = ListCell
