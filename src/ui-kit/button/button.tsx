import { ComponentChildren } from 'preact'
import { IconNames, IconSize } from '@pv/ui-kit/icon/types'
import { Icon } from '@pv/ui-kit/icon'
import { Container } from './button-styles'

type Props = {
  children?: ComponentChildren
  iconName?: IconNames
  iconSize?: IconSize
  variant?: 'primary' | 'secondary'
  shape?: 'rect' | 'circle'
  isDisabled?: boolean
  onClick?: () => void
}

export function Button({
  children,
  iconName,
  iconSize,
  variant,
  onClick,
  isDisabled,
  shape = 'rect',
}: Props) {
  return (
    <Container onClick={onClick} disabled={isDisabled} data-shape={shape} data-variant={variant}>
      {iconName && <Icon iconName={iconName} iconSize={iconSize} />}
      {children}
    </Container>
  )
}
