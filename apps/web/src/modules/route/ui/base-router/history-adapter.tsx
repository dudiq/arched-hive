import { useHistoryContext } from '@pv/history/interface/use-history-context'
import { useLocation } from 'wouter'

export function HistoryAdapter() {
  const [pathname, setLocation] = useLocation()
  const { historyStore, routerHistory } = useHistoryContext()

  routerHistory.setHistory(setLocation)

  historyStore.updateState(pathname)

  return null
}
