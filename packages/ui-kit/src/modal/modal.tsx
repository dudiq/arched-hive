import { Portal } from '../portal'

import { ModalBody } from './modal-body'
import { ModalFooter } from './modal-footer'
import { ModalHeader } from './modal-header'

import type { ReactNode } from 'react'

type Props = {
  onClose?: () => void
  isOpen: boolean
  children: ReactNode
}

export function ModalRoot({ children, isOpen }: Props) {
  if (!isOpen) return null
  return (
    <Portal>
      <div
        tabIndex={-1}
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full flex"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  )
}

export const Modal = Object.assign(ModalRoot, {
  Footer: ModalFooter,
  Header: ModalHeader,
  Body: ModalBody,
})
