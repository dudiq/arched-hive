import { hookContextFactory } from '@pv/interface/services/hook-context-factory'

import { HistoryStore } from './stores/history.store'
import { RouterHistory } from './services/history.service/router-history'

export const { useModuleContext: useHistoryContext } = hookContextFactory({
  routerHistory: RouterHistory,
  historyStore: HistoryStore,
})
