import * as assets from './icon-assets'

import type { IconNames, IconSize } from './types'

export type IconName = keyof typeof assets

type Props = {
  iconName?: IconNames
  name?: IconName
  iconSize?: IconSize
}

export function Icon({ name, iconSize = 'normal' }: Props) {
  if (!name) return null

  if (!assets[name]) {
    console.error('-icon not defined name', name)
  }
  const IconComponent = assets[name] || null

  return (
    <span className={'flex items-center justify-center'} data-icon={name}>
      <IconComponent />
    </span>
  )
}
