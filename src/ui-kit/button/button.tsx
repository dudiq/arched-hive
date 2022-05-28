import { ComponentChildren } from 'preact'
import { IconNames } from '@pv/ui-kit/icon/types'
import { Icon } from '@pv/ui-kit/icon'
import { Container } from './button-styles'

type Props = {
  children?: ComponentChildren
  icon?: IconNames
  // variant?: 'primary' | 'secondary' | 'flat'
  shape?: 'rect' | 'circle'
  isDisabled?: boolean
  onClick?: () => void
}

export function Button({ children, icon, onClick, isDisabled, shape = 'rect' }: Props) {
  return (
    <Container onClick={onClick} disabled={isDisabled} data-shape={shape}>
      {icon && <Icon iconName={icon} />}
      {children}
    </Container>
  )
}
