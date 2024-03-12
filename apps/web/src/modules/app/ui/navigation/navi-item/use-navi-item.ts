import { useCallback } from 'react'
import { useHistoryContext } from '@pv/interface/use-history-context'
import { useAppContext } from '@pv/modules/app/interface/use-app-context'

type Args = {
  path: string
  isMatch?: boolean
}

export function useNaviItem({ isMatch, path }: Args) {
  const { historyStore } = useHistoryContext()
  const isMatched = isMatch
    ? historyStore.pathname === path
    : historyStore.pathname.startsWith(path)
  const { navigationAction } = useAppContext()
  const handleChangePage = useCallback(() => {
    navigationAction.handleChangePage(path)
  }, [navigationAction, path])

  return {
    isMatched,
    handleChangePage,
  }
}
