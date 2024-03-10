import { extendedClasses, ListCellWrapper } from '@pv/ui-kit/list/list-styles'
import { ComponentChildren } from 'preact'

type Props = {
  children: ComponentChildren
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
