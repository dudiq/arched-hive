import { createPortal } from 'react-dom'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Portal({ children }: Props) {
  const container = document.getElementById('portal')
  if (!container) return null

  return <>{createPortal(<>{children}</>, container)}</>
}
