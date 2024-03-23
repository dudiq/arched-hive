import {useInject} from '@pv/app/interface/use-inject';

import { RouterHistory } from '@pv/history/interface/history.service/router-history'
import { HistoryStore } from './history.store'


export function useHistoryContext() {
  return useInject({
    routerHistory: RouterHistory,
    historyStore: HistoryStore,
  })
}
