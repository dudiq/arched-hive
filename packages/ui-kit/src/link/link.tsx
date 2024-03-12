import { Icon } from '../icon'

import { Container, ContentWrapper, IconWrapper } from './link-styles'

import type { ReactNode } from 'react'
import type { IconNames } from '../icon/types'

type Props = {
  children?: ReactNode
  icon?: IconNames
  isDisabled?: boolean
  onClick?: () => void
}

export function Link({ children, icon, onClick, isDisabled }: Props) {
  return (
    <Container onClick={onClick} disabled={isDisabled}>
      {!!icon && (
        <IconWrapper>
          <Icon iconName={icon} />
        </IconWrapper>
      )}
      <ContentWrapper>{children}</ContentWrapper>
    </Container>
  )
}
