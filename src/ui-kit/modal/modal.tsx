import { ComponentChildren } from 'preact'
import { Portal } from '@pv/ui-kit/portal'
import { ModalContainer } from './modal-container'

type Props = {
  onClose: () => void
  isVisible: boolean
  children: ComponentChildren
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
