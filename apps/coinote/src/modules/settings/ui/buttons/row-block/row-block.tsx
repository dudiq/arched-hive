import { ComponentChildren } from 'preact'
import { Link } from '@pv/ui-kit/link'
import { IconNames } from '@pv/ui-kit/icon/types'
import { Row } from './row-block-styles'

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
