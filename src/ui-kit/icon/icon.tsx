import { IconNames } from './types'
import './icons.css'

type Props = {
  iconName: IconNames
}

export function Icon({ iconName }: Props) {
  return <span className={`x-icon-${iconName}`} />
}
