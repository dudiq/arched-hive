import { ComponentChildren } from 'preact'
import { Portal } from '@pv/ui-kit/portal'
import { Container } from './modal-styles'

type Props = {
  isVisible: boolean
  children: ComponentChildren
}

export function Modal({ children, isVisible }: Props) {
  if (!isVisible) return null
  return (
    <Portal>
      <Container>{children}</Container>
    </Portal>
  )
}
