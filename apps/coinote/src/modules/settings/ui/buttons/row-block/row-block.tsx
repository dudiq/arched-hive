import { Link } from '@repo/ui-kit'

import { Row } from './row-block-styles'

import type { IconNames } from '@repo/ui-kit'
import type { ComponentChildren } from 'preact'

type Props = {
  icon: IconNames
  children: ComponentChildren
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
