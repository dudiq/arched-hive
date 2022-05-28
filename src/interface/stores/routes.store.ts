import { Store } from '@pv/di'
import type { RouteEntity } from '@pv/core/entities/route.entity'

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
