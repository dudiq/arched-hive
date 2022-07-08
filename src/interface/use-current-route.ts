import { useRouter } from 'wouter-preact'
import { useMemo } from 'preact/compat'
import { useRoutesContext } from './use-router-context'
import { useHistoryContext } from './use-history-context'

export function useCurrentRoute() {
  const { routesStore } = useRoutesContext()
  const { historyStore } = useHistoryContext()
  const router = useRouter()

  const currentRoute = useMemo(() => {
    const matchedRoute = routesStore.routes.find((route) => {
      const [isMatched] = router.matcher(route.route.path || '', historyStore.pathname)
      return isMatched
    })

    if (matchedRoute) return matchedRoute

    return routesStore.routes.find((route) => !route.route.path)
  }, [historyStore.pathname, router, routesStore.routes])

  return {
    currentRoute,
  }
}
