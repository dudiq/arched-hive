import * as assets from './icon-assets'

import type { IconSize } from './types'

export type IconName = keyof typeof assets

type Props = {
  name: IconName
  size?: IconSize
  /**
   * @deprecated use size instead
   */
  iconSize?: IconSize
}

const iconSizeMap: Record<IconSize, string> = {
  big: 'h-[18px] w-[18px]',
  huge: 'h-[28px] w-[28px]',
  normal: 'h-[14px] w-[14px]',
  small: 'h-[10px] w-[10px]',
}

export function Icon({ name, size = 'normal' }: Props) {
  if (!name) return null

  if (!assets[name]) {
    console.error('-icon not defined name', name)
  }

  const sizeClass = iconSizeMap[size]
  const IconComponent = assets[name] || null

  return (
    <span
      className={`flex items-center justify-center ${sizeClass}`}
      data-icon={name}
    >
      <IconComponent />
    </span>
  )
}
