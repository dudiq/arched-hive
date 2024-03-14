import { Link } from '@repo/ui-kit'

import { Row } from './row-block-styles'

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
      <Row onClick={onClick}>
        <Link icon={icon}>{children}</Link>
      </Row>
    </div>
  )
}
