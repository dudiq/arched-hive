import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { NavigationAction } from './actions/navigation.action'
import { EmptyAction } from './actions/empty.action'
import { EmptyStore } from './stores/empty.store'

export const { useModuleContext: useAppContext } = hookContextFactory({
  navigationAction: NavigationAction,
  emptyAction: EmptyAction,
  emptyStore: EmptyStore,
})
