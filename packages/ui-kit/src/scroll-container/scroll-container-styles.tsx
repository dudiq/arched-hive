import type { ReactNode } from 'react'

export const ScrollContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="w-full overflow-y-auto overflow-x-hidden top-0 bottom-0 absolute"
      style={{
        WebkitOverflowScrolling: 'touch', // ios bug
      }}
    >
      {children}
    </div>
  )
}
