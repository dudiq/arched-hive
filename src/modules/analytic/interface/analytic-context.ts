import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { AnalyticStore } from './stores/analytic.store'
import { AnalyticAction } from './actions/analytic.action'

export const { useModuleContext: analyticContext } = hookContextFactory({
  analyticStore: AnalyticStore,
  analyticAction: AnalyticAction,
})
