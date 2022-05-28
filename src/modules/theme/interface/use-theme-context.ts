import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { ThemeAction } from './actions/theme.action'
import { ThemeStore } from './stores/theme.store'

export const { useModuleContext: useThemeContext } = hookContextFactory({
  themeAction: ThemeAction,
  themeStore: ThemeStore,
})
