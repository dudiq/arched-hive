import { Icon } from '../icon'

import type { ReactNode } from 'react'
import type { IconNames, IconSize } from '../icon'
import type { ButtonShape, ButtonVariant } from './types'

type Props = {
  children?: ReactNode
  iconName?: IconNames
  iconSize?: IconSize
  variant?: ButtonVariant
  shape?: ButtonShape
  isDisabled?: boolean
  onClick?: () => void
}

const shapeMap: Record<ButtonShape, string> = {
  circle: 'rounded-full',
  rect: '',
}

const variantMap: Record<ButtonVariant, string> = {
  flat: '',
  primary: '',
  secondary: '',
}

export function Button({
  children,
  iconName,
  iconSize,
  variant = 'flat',
  onClick,
  isDisabled,
  shape = 'rect',
}: Props) {
  const shapeClass = shapeMap[shape] || ''
  const variantClass = variantMap[variant] || ''

  const buttonClass = `${shapeClass} ${variantClass} py-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`
  return (
    <button onClick={onClick} disabled={isDisabled} className={buttonClass}>
      {!!iconName && <Icon iconName={iconName} iconSize={iconSize} />}
      {children}
    </button>
  )
}
