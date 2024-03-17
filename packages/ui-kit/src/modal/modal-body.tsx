import type { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}
export function ModalBody({ children }: Props) {
  return <div className="p-4 md:p-5 space-y-4">{children}</div>
}
