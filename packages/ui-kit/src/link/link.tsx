import { Icon } from '../icon'

import type { ReactNode } from 'react'
import type { IconName } from '../icon'

type Props = {
  children?: ReactNode
  icon?: IconName
  onClick?: () => void
}

export function Link({ children, icon, onClick }: Props) {
  return (
    <a className="flex cursor-pointer items-center gap-2" onClick={onClick}>
      {!!icon && <Icon name={icon} />}
      <div className="underline">{children}</div>
    </a>
  )
}
