import { ComponentChildren } from 'preact'
import { useModal } from '@pv/ui-kit/modal/use-modal'
import { Container } from '@pv/ui-kit/modal/modal-styles'

type Props = {
  onClose: () => void
  isVisible: boolean
  children: ComponentChildren
}

export function ModalContainer({ children, isVisible, onClose }: Props) {
  const { isContainerShown } = useModal({ onClose, isVisible })

  if (!isContainerShown) return null
  return <Container>{children}</Container>
}
