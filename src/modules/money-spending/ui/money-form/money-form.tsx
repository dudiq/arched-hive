import { Modal } from '@pv/ui-kit/modal'

type Props = {
  isVisible: boolean
}

export function MoneyForm({ isVisible }: Props) {
  return <Modal isVisible={isVisible}>test</Modal>
}
