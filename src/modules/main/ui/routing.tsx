import {Fragment} from "preact";
import Router from "preact-router";
import {useRoutesContext} from "../interface/use-router-context";

export function Routing() {
  const {routesStore} = useRoutesContext()
  return (
    <Router>
      {routesStore.routes.map((routeItem) => {
        const {route, component: ScreenComponent} = routeItem
        return (
          <Fragment key={route.path} path={route.path}>
            <ScreenComponent/>
          </Fragment>
        )
      })}
    </Router>
  )
}
