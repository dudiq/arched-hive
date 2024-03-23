import { Swap } from '@repo/ui-kit'

import type { ReactNode } from 'react'

type Props = {
  title: string
  rightSlot?: ReactNode
}

export function Header({ title, rightSlot }: Props) {
  return (
    <div className="min-h-12 flex items-center gap-2 w-full">
      <div className="text-xl ">{title}</div>
      <Swap has={!!rightSlot}>
        <div className="ml-auto">{rightSlot}</div>
      </Swap>
    </div>
  )
}
