import { Separator, Swap } from '@repo/ui-kit'

import type { ReactNode } from 'react'

type Props = {
  headerSlot?: ReactNode
  footerSlot?: ReactNode
  children: ReactNode
}

export const Layout = ({ children, headerSlot, footerSlot }: Props) => {
  return (
    <div className="max-w-2xl flex flex-col overflow-x-hidden mx-auto w-full h-screen">
      <Swap has={!!headerSlot}>
        <div className="">
          {headerSlot}
          <Separator />
        </div>
      </Swap>
      <div className="flex flex-col relative flex-1">{children}</div>
      <Swap has={!!footerSlot}>
        <div>{footerSlot}</div>
      </Swap>
    </div>
  )
}
