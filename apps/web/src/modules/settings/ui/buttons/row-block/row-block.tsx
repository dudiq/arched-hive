import { Link } from '@repo/ui-kit'

import type { IconName } from '@repo/ui-kit'
import type { ReactNode } from 'react'

type Props = {
  icon: IconName
  children: ReactNode
  onClick?: () => void
}
export function RowBlock({ children, icon, onClick }: Props) {
  return (
    <div onClick={onClick}>
      <Link icon={icon}>{children}</Link>
    </div>
  )
}
