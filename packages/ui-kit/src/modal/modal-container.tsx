import { ComponentChildren } from 'preact'
import { useModal } from './use-modal'
import { Container, ContainerBg, Overlay } from './modal-styles'
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
      <Container>
        <Overlay onClick={handleClose} />
        <ContainerBg>{children}</ContainerBg>
      </Container>
    </>
  )
}
