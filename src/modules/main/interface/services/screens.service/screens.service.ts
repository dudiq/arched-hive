import { Service, Inject } from '@pv/di'
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
