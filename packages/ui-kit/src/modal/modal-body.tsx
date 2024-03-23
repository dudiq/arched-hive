import type { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}
export function ModalBody({ children }: Props) {
  return <div className="p-2 md:p-3 space-y-2">{children}</div>
}
