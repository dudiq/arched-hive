// import { Icon } from '../icon'

import { IconWrapper } from './link-styles'

import type { ReactNode } from 'react'
import type { IconNames } from '../icon/types'

type Props = {
  children?: ReactNode
  icon?: IconNames
  onClick?: () => void
}

export function Link({ children, icon, onClick }: Props) {
  return (
    <div className="flex cursor-pointer items-center" onClick={onClick}>
      {!!icon && <IconWrapper>{/* <Icon iconName={icon} />*/}</IconWrapper>}
      <div className="underline">{children}</div>
    </div>
  )
}
