import {useInject} from '@pv/app/interface/use-inject';

import { ThemeAction } from './actions/theme.action'
import { ThemeStore } from './stores/theme.store'

export function useThemeContext() {
  return useInject({
    themeAction: ThemeAction,
    themeStore: ThemeStore,
  })
}
