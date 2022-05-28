import { ComponentChildren } from 'preact'
import { IconNames } from '@pv/ui-kit/icon/types'
import { Icon } from '@pv/ui-kit/icon'
import { Container } from './link-styles'

type Props = {
  children?: ComponentChildren
  icon?: IconNames
  isDisabled?: boolean
  onClick?: () => void
}

export function Link({ children, icon, onClick, isDisabled }: Props) {
  return (
    <Container onClick={onClick} disabled={isDisabled}>
      {icon && <Icon iconName={icon} />}
      {children}
    </Container>
  )
}
