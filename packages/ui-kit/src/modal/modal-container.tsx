import { Container, ContainerBg, Overlay } from './modal-styles'
import { useModal } from './use-modal'
import { useModalHandleClose } from './use-modal-handle-close'

import type { ReactNode } from 'react'

type Props = {
  onClose: () => void
  isVisible: boolean
  children: ReactNode
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
