import { Button } from '@repo/ui-kit'

import type { IconName } from '@repo/ui-kit'
import type { ReactNode } from 'react'

type Props = {
  icon: IconName
  children: ReactNode
  onClick?: () => void
}
export function RowBlock({ children, icon, onClick }: Props) {
  return (
    <div>
      <Button iconName={icon} onClick={onClick}>
        {children}
      </Button>
    </div>
  )
}
