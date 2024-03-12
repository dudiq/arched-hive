import { ListCell } from './list-cell'
import { ListContainer, ListRow } from './list-styles'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function List({ children }: Props) {
  return <ListContainer>{children}</ListContainer>
}

List.Row = ListRow
List.Cell = ListCell
