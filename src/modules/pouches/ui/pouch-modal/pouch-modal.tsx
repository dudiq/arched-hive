import { observer } from 'mobx-react-lite'
import { Modal } from '@pv/ui-kit/modal'
import { usePouchContext } from '@pv/modules/pouches/interface/use-pouch-context'
import { PouchModalContent } from './pouch-modal-content'

export const PouchModal = observer(() => {
  const { pouchStore, pouchAction } = usePouchContext()

  return (
    <Modal onClose={pouchAction.handleClosePouchesList} isVisible={pouchStore.isModalVisible}>
      <PouchModalContent />
    </Modal>
  )
})
