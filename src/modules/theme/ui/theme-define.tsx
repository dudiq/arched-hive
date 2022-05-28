import { observer } from 'mobx-react-lite'
import { useTheme } from './use-theme'

export const ThemeDefine = observer(() => {
  useTheme()
  return null
})
