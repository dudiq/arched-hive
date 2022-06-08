import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { FocusStore } from './stores/focus.store'
import { FocusAction } from './action/focus.action'

export const { useModuleContext: useFocusContext } = hookContextFactory({
  focusStore: FocusStore,
  focusAction: FocusAction,
})
