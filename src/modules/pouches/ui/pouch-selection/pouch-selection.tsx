import { observer } from 'mobx-react-lite'
import { usePouchContext } from '@pv/modules/pouches/interface/use-money-spending-context'
import { Link } from '@pv/ui-kit/link'
import { Modal } from '@pv/ui-kit/modal'

export const PouchSelection = observer(() => {
  const { pouchStore, pouchAction } = usePouchContext()

  return (
    <>
      <Link icon="wallet" onClick={pouchAction.handleOpenPouchesList}>
        {pouchStore.currentPouchName}
      </Link>
      <Modal onClose={pouchAction.handleClosePouchesList} isVisible={pouchStore.isModalVisible}>
        test
      </Modal>
    </>
  )
})
