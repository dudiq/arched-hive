import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { NavigationAction } from './actions/navigation.action'

export const { useModuleContext: useAppContext } = hookContextFactory({
  navigationAction: NavigationAction,
})
