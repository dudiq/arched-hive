import { ComponentChildren } from 'preact'
import { Link } from '@pv/ui-kit/link'
import { Row } from './row-block-styles'

type Props = {
  children: ComponentChildren
}
export function RowBlock({ children }: Props) {
  return (
    <div>
      <Row>
        <Link>{children}</Link>
      </Row>
    </div>
  )
}
