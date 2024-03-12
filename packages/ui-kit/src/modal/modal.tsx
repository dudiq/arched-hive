import { Portal } from '../portal'

import { ModalContainer } from './modal-container'

import type { ReactNode } from 'react'

type Props = {
  onClose: () => void
  isVisible: boolean
  children: ReactNode
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
