import { Modal } from '@pv/ui-kit/modal'

type Props = {
  isVisible: boolean
  onClose: () => void
}

export function MoneyForm({ isVisible, onClose }: Props) {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      test
    </Modal>
  )
}
