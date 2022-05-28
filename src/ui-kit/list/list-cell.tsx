import { ListCellWrapper } from '@pv/ui-kit/list/list-styles'
import { ComponentChildren } from 'preact'

type Props = {
  children: ComponentChildren
  isCentered?: boolean
  isFullwidth?: boolean
}

export function ListCell({ children, isCentered, isFullwidth }: Props) {
  return (
    <ListCellWrapper data-is-centered={isCentered} data-is-fullwidth={isFullwidth}>
      {children}
    </ListCellWrapper>
  )
}
