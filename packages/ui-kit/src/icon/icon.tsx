// import { IconWrapper } from './icon-styles'

import './icons.css'

import type { IconNames, IconSize } from './types'

type Props = {
  iconName: IconNames
  iconSize?: IconSize
}

export function Icon({ iconName, iconSize = 'normal' }: Props) {
  return <span className={`x-icon-${iconName}`} />
}
