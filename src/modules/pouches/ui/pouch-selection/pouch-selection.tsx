import { observer } from 'mobx-react-lite'
import { usePouchContext } from '@pv/modules/pouches/interface/use-money-spending-context'
import { Link } from '@pv/ui-kit/link'
import { Container } from './pouch-selection-styles'

export const PouchSelection = observer(() => {
  const { pouchStore, pouchAction } = usePouchContext()

  return (
    <Container>
      <Link icon="wallet" onClick={pouchAction.handleOpenPouchesList}>
        {pouchStore.currentPouchName}
      </Link>
    </Container>
  )
})
