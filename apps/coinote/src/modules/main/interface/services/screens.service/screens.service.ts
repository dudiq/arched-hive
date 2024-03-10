import { Service, Inject } from '@repo/service'
import { RoutesStore } from '@pv/interface/stores/routes.store'
import { routes } from './routes'

@Service()
export class ScreensService {
  constructor(
    @Inject()
    private routesStore: RoutesStore,
  ) {}

  handlerRegisterRoutes() {
    this.routesStore.addRoutes(routes)
  }
}
