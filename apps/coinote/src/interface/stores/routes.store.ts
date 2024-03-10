import { Store } from '@repo/service'
import type { RouteEntity } from '@pv/modules/app/core/route.entity'

@Store()
export class RoutesStore {
  private routeList: RouteEntity[] = []

  addRoutes(newRoutes: RouteEntity[]) {
    this.routeList = [...this.routeList, ...newRoutes]
  }

  get routes() {
    return this.routeList
  }
}
