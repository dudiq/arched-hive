import { Module, Container, Inject } from '@pv/di'
import { startRender } from './start-render'
import { ScreensService } from './interface/services/screens.service/screens.service'

@Module()
export class MainModule {
  constructor(
    @Inject()
    private screensService: ScreensService,
  ) {}

  async start() {
    return new Promise<void>((resolve) => {
      this.render()
      resolve()
    })
  }

  private render() {
    this.screensService.handlerRegisterRoutes()
    startRender()
  }

  static getInstance() {
    return Container.get(MainModule)
  }
}
