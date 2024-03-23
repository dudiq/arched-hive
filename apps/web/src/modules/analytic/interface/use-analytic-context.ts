import {useInject} from '@pv/app/interface/use-inject';

import { AnalyticAction } from './actions/analytic.action'
import { AnalyticStore } from './stores/analytic.store'

export function useAnalyticContext() {
  return useInject({
    analyticStore: AnalyticStore,
    analyticAction: AnalyticAction,
  })
}
