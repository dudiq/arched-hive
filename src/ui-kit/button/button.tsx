import { ComponentChildren } from 'preact'
import { IconNames } from '@pv/ui-kit/icon/types'
import { Icon } from '@pv/ui-kit/icon'

type Props = {
  children: ComponentChildren
  leftIcon?: IconNames
  rightIcon?: IconNames
  variant?: 'primary' | 'secondary' | 'flat'
  shape?: 'rect' | 'square' | 'circle'
  isDisabled?: boolean
  isLoading?: boolean
  onClick?: () => void
}

export function Button({ children, leftIcon, rightIcon, onClick, isDisabled }: Props) {
  return (
    <button onClick={onClick} disabled={isDisabled}>
      {leftIcon && <Icon iconName={leftIcon} />}
      {children}
      {rightIcon && <Icon iconName={rightIcon} />}
    </button>
  )
}
