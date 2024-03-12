import {observer} from '@repo/service';

import { useTheme } from './use-theme'

export const ThemeDefine = observer(() => {
  useTheme()
  return null
})
