import { ComponentChildren } from 'preact'
import { IconNames } from '@pv/ui-kit/icon/types'
import { Icon } from '@pv/ui-kit/icon'
import { Label } from './button-styles'

type Props = {
  children: ComponentChildren
  leftIcon?: IconNames
  rightIcon?: IconNames
  onClick?: () => void
}

export function Button({ children, leftIcon, rightIcon, onClick }: Props) {
  return (
    <button onClick={onClick}>
      <Label>tesst</Label>
      {leftIcon && <Icon iconName={leftIcon} />}
      {children}
      {rightIcon && <Icon iconName={rightIcon} />}
    </button>
  )
}
