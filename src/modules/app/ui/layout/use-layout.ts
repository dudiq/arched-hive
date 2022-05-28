import { useRouter } from 'wouter-preact'
import { useMemo } from 'preact/compat'
import { useRoutesContext } from '@pv/interface/use-router-context'
import { useHistoryContext } from '@pv/interface/use-history-context'

export function useLayout() {
  const { routesStore } = useRoutesContext()
  const { historyStore } = useHistoryContext()
  const router = useRouter()

  const usedRoute = useMemo(() => {
    const matchedRoute = routesStore.routes.find((route) => {
      const [isMatched] = router.matcher(route.route.path || '', historyStore.pathname)
      return isMatched
    })

    if (matchedRoute) return matchedRoute

    return routesStore.routes.find((route) => !route.route.path)
  }, [historyStore.pathname, router, routesStore.routes])

  return {
    usedRoute,
  }
}
