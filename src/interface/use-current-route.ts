import { useRouter } from 'wouter-preact'
import { useMemo } from 'preact/compat'
import { useRoutesContext } from './use-router-context'
import { useHistoryContext } from './use-history-context'

export function useCurrentRoute() {
  const { routesStore } = useRoutesContext()
  const { historyStore } = useHistoryContext()
  const router = useRouter()

  const pathname = historyStore.pathname.split('?')[0]

  const currentRoute = useMemo(() => {
    const matchedRoute = routesStore.routes.find((route) => {
      const [isMatched] = router.matcher(route.route.path || '', pathname)
      return isMatched
    })

    if (matchedRoute) return matchedRoute

    // return not found page
    return routesStore.routes.find((route) => !route.route.path)
  }, [pathname, router, routesStore.routes])

  return {
    currentRoute,
  }
}
