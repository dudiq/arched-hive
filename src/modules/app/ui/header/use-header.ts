import { useHistoryContext } from '@pv/interface/use-history-context'
import { useMemo } from 'preact/compat'
import { t } from '@pv/interface/services/i18n'
import { Routes } from '@pv/contants/routes'

export function useHeader() {
  const { historyStore } = useHistoryContext()

  const pathname = historyStore.pathname
  const title = useMemo(() => {
    switch (pathname) {
      case Routes.settings:
        return t('pages.settings')
      case Routes.categories:
        return t('pages.category')
      case Routes.analytic:
        return t('pages.analytic')
      case Routes.expense:
        return t('pages.expense')
      default:
        return ''
    }
  }, [pathname])

  const isPouchVisible = useMemo(() => {
    if (pathname === Routes.categories) return true
    return pathname === Routes.expense
  }, [pathname])

  return {
    title,
    isPouchVisible,
  }
}
