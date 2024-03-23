import { useInject } from '@pv/app/interface/use-inject'
import { useModal } from '@pv/app/interface/use-modal'
import { t } from '@pv/i18n'
import { PouchStore } from '@pv/pouches'

import { observer } from '@repo/service'
import { Link, Modal } from '@repo/ui-kit'

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
      <Link icon="Wallet" onClick={handleOpen}>
        {pouchStore.currentPouchName}
      </Link>
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
