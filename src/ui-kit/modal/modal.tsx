import { ComponentChildren } from 'preact'
import { Portal } from '@pv/ui-kit/portal'
import { Container } from './modal-styles'
import { useModal } from './use-modal'

type Props = {
  onClose: () => void
  isVisible: boolean
  children: ComponentChildren
}

function ModalContainer({ children, isVisible, onClose }: Props) {
  const { isContainerShown } = useModal({ onClose, isVisible })

  if (!isContainerShown) return null
  return <Container>{children}</Container>
}

export function Modal({ children, isVisible, onClose }: Props) {
  if (!isVisible) return null
  return (
    <Portal>
      <ModalContainer isVisible={isVisible} onClose={onClose}>
        {children}
      </ModalContainer>
    </Portal>
  )
}
