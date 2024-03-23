import { useInject } from '@pv/app/interface/use-inject'
import { RouterHistory } from '@pv/history/interface/history.service/router-history'
import { HistoryStore } from '@pv/history/interface/history.store'
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
