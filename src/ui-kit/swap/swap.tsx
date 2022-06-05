import { ComponentChildren } from 'preact'

type Props = {
  is?: boolean
  isSlot?: ComponentChildren
  children?: ComponentChildren
}

export function Swap(props: Props) {
  if (props.is) return <>{props.isSlot}</>
  return <>{props.children}</>
}
