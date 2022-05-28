import { Switch, Route } from 'wouter-preact'
import { useRoutesContext } from '../interface/use-router-context'

export function ScreensSwitch() {
  const { routesStore } = useRoutesContext()

  return (
    <Switch>
      {routesStore.routes.map((routeItem) => {
        const { route, component: ScreenComponent } = routeItem
        return (
          <Route key={route.path} path={route.path}>
            <ScreenComponent />
          </Route>
        )
      })}
    </Switch>
  )
}
