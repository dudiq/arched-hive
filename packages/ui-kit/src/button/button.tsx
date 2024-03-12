import { Icon } from '../icon'

import { Container, extendedClasses, Wrapper } from './button-styles'

import type { ReactNode } from 'react'
import type { IconNames, IconSize } from '../icon/types'
import type { ButtonShape, ButtonVariant } from './types'

type Props = {
  children?: ReactNode
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
    <Container
      onClick={onClick}
      disabled={isDisabled}
      className={extendedClasses({ variant, shape })}
    >
      {!!iconName && <Icon iconName={iconName} iconSize={iconSize} />}
      {!!hasChildren && (
        <Wrapper data-has-icon={!!iconName}>{children}</Wrapper>
      )}
    </Container>
  )
}
