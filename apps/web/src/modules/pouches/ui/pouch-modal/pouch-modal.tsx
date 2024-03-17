import { usePouchContext } from '@pv/pouches/interface/use-pouch-context'

import { observer } from '@repo/service'
import { Modal } from '@repo/ui-kit'

import { PouchModalContent } from './pouch-modal-content'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

type Props = {
  onSelect: (pouchId: PouchId) => void
}

export const PouchModal = observer(({ onSelect }: Props) => {
  const { pouchStore, pouchAction } = usePouchContext()

  return (
    <Modal
      onClose={pouchAction.handleClosePouchesList}
      isOpen={pouchStore.isModalVisible}
    >
      <PouchModalContent onSelect={onSelect} />
    </Modal>
  )
})
