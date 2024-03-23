// import { useMemo } from 'react'
// import { useRouter } from 'wouter'
//
// import { useHistoryContext } from '../../history/interface/use-history-context'

export function useCurrentRoute() {
  // const { routesStore } = useRoutesContext()
  // const { historyStore } = useHistoryContext()
  // const router = useRouter()
  //
  // const pathname = historyStore.pathname.split('?')[0]
  //
  // const currentRoute = useMemo(() => {
  //   const matchedRoute = routesStore.routes.find((route) => {
  //     const [isMatched] = router.matcher(route.route.path || '', pathname)
  //     return isMatched
  //   })
  //
  //   if (matchedRoute) return matchedRoute
  //
  //   // return not found page
  //   return routesStore.routes.find((route) => !route.route.path)
  // }, [pathname, router, routesStore.routes])

  return {
    currentRoute: {
      header:{
        title: () => '',
        component: undefined
      },
    },
  }
}
