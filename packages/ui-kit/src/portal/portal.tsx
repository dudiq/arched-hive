import { createPortal } from 'preact/compat'
import { ComponentChildren } from 'preact'

type Props = {
  children: ComponentChildren
}

export function Portal({ children }: Props) {
  const container = document.getElementById('portal')
  if (!container) return null

  return <>{createPortal(<>{children}</>, container)}</>
}
