import { useHistoryContext } from '@pv/interface/use-history-context'
import { useMemo } from 'preact/compat'
import { t } from '@pv/interface/services/i18n'

export function useHeader() {
  const { historyStore } = useHistoryContext()

  const pathname = historyStore.pathname
  const title = useMemo(() => {
    if (pathname === '/') return t('pages.expense')
    switch (pathname) {
      case '/settings':
        return t('pages.settings')
      case '/category':
        return t('pages.category')
      case '/analytic':
        return t('pages.analytic')
      default:
        t('pages.expense')
    }
  }, [pathname])

  const isPouchVisible = useMemo(() => {
    if (pathname === '/category') return true
    return pathname === '/'
  }, [pathname])

  return {
    title,
    isPouchVisible,
  }
}
