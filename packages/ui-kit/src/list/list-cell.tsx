import { extendedClasses, ListCellWrapper } from '../list/list-styles'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  isCentered?: boolean
  isFullwidth?: boolean
}

export function ListCell({ children, isCentered, isFullwidth }: Props) {
  return (
    <ListCellWrapper className={extendedClasses({ isFullwidth, isCentered })}>
      {children}
    </ListCellWrapper>
  )
}
