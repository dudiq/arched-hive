import {useInject} from '@pv/modules/app/interface/use-inject';

import { RouterHistory } from './services/history.service/router-history'
import { HistoryStore } from './stores/history.store'


export function useHistoryContext() {
  return useInject({
    routerHistory: RouterHistory,
    historyStore: HistoryStore,
  })
}
