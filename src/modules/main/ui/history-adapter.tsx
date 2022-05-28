import { useLocation } from 'wouter-preact'
import { useHistoryContext } from '../interface/use-history-context'

export function HistoryAdapter() {
  const [pathname, setLocation] = useLocation()
  const { historyStore, routerHistory } = useHistoryContext()

  routerHistory.setHistory(setLocation)

  historyStore.updateState(pathname)

  return null
}
