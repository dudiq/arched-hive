import { observer } from 'mobx-react-lite'
import { Modal } from '@pv/ui-kit/modal'
import { usePouchContext } from '@pv/modules/pouches/interface/use-pouch-context'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { PouchModalContent } from './pouch-modal-content'

type Props = {
  onSelect: (pouchId: PouchId) => void
}

export const PouchModal = observer(({ onSelect }: Props) => {
  const { pouchStore, pouchAction } = usePouchContext()

  return (
    <Modal onClose={pouchAction.handleClosePouchesList} isVisible={pouchStore.isModalVisible}>
      <PouchModalContent onSelect={onSelect} />
    </Modal>
  )
})
