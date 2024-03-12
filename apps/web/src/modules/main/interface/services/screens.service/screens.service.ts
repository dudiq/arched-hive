import { RoutesStore } from '@pv/interface/stores/routes.store'

import { Inject, Service } from '@repo/service'

import { routes } from './routes'

@Service()
export class ScreensService {
  constructor(private routesStore = Inject(RoutesStore)) {}

  handlerRegisterRoutes() {
    this.routesStore.addRoutes(routes)
  }
}
