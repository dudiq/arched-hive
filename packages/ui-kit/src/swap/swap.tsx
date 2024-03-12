import type { ReactNode } from 'react'

type Props = {
  is?: boolean
  isSlot?: ReactNode
  children?: ReactNode
}

export function Swap(props: Props) {
  if (props.is) return <>{props.isSlot}</>
  return <>{props.children}</>
}
