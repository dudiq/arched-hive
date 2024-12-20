import { RouterHistory } from '@pv/history/interface/history.service/router-history'
import { HistoryStore } from '@pv/history/interface/history.store'
import { useInject } from '@pv/service/interface/use-inject'
import { useLocation } from 'wouter'

export function HistoryAdapter() {
  const [pathname, setLocation] = useLocation()
  const { historyStore, routerHistory } = useInject({
    routerHistory: RouterHistory,
    historyStore: HistoryStore,
  })

  routerHistory.setHistory(setLocation)

  historyStore.updateState(pathname)

  return null
}
