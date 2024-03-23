import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function ListRow({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <div className="flex min-h-10 items-center gap-2" onClick={onClick}>
      {children}
    </div>
  )
}

function ListCell({ children }: Props) {
  return <div className="flex">{children}</div>
}

export function ListRoot({ children }: Props) {
  return <div>{children}</div>
}

export const List = Object.assign(ListRoot, {
  Row: ListRow,
  Cell: ListCell,
})
