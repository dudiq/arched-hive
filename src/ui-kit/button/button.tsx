import { ComponentChildren } from 'preact'
import { IconNames, IconSize } from '@pv/ui-kit/icon/types'
import { Icon } from '@pv/ui-kit/icon'
import { Container, Wrapper } from './button-styles'
import { ButtonShape, ButtonVariant } from './types'

type Props = {
  children?: ComponentChildren
  iconName?: IconNames
  iconSize?: IconSize
  variant?: ButtonVariant
  shape?: ButtonShape
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
  const hasChildren = !!children
  return (
    <Container onClick={onClick} disabled={isDisabled} data-shape={shape} data-variant={variant}>
      {iconName && <Icon iconName={iconName} iconSize={iconSize} />}
      {hasChildren && <Wrapper data-has-icon={!!iconName}>{children}</Wrapper>}
    </Container>
  )
}
