import { ComponentChildren } from 'preact'
import { useModal } from './use-modal'
import { Container, Overlay } from './modal-styles'
import { useModalHandleClose } from './use-modal-handle-close'

type Props = {
  onClose: () => void
  isVisible: boolean
  children: ComponentChildren
}

export function ModalContainer({ children, isVisible, onClose }: Props) {
  const { isContainerShown } = useModal({ onClose, isVisible })
  const { handleClose } = useModalHandleClose()

  if (!isContainerShown) return null
  return (
    <>
      <Overlay onClick={handleClose} />
      <Container>{children}</Container>
    </>
  )
}
