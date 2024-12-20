import { t } from '@pv/i18n'
import { PouchStore } from '@pv/pouches'
import { useInject } from '@pv/service/interface/use-inject'
import { useModal } from '@pv/service/interface/use-modal'

import { observer } from '@repo/service'
import { Icon, Modal } from '@repo/ui-kit'

import { PouchModalContent } from './pouch-modal-content'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

type Props = {
  onSelect: (pouchId: PouchId) => void
}

export const PouchModal = observer(({ onSelect }: Props) => {
  const { pouchStore } = useInject({
    pouchStore: PouchStore,
  })

  const { isOpen, handleOpen, handleClose } = useModal('pouch-modal')

  return (
    <>
      <button
        className="flex items-center gap-2 text-gray-400 underline"
        onClick={handleOpen}
      >
        <Icon name="Wallet" />
        {pouchStore.currentPouchName}
      </button>
      <Modal onClose={handleClose} isOpen={isOpen}>
        <Modal.Header
          title={t('pouchBlock.modalTitle')}
          onClose={handleClose}
        />
        <Modal.Body>
          <PouchModalContent onSelect={onSelect} />
        </Modal.Body>
      </Modal>
    </>
  )
})
