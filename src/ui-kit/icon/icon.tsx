import { IconNames, IconSize } from './types'
import { IconWrapper } from './icon-styles'
import './icons.css'

type Props = {
  iconName: IconNames
  iconSize?: IconSize
}

export function Icon({ iconName, iconSize = 'normal' }: Props) {
  return <IconWrapper className={`x-icon-${iconName}`} data-size={iconSize} />
}
