import { Module, Container, Inject } from '@pv/di'
import { AppModule } from '@pv/modules/app'
import { ScreensService } from './interface/services/screens.service'

@Module()
export class MainModule {
  constructor(
    @Inject()
    private screensService: ScreensService,
    @Inject()
    private appModule: AppModule,
  ) {}

  async start() {
    return new Promise<void>((resolve) => {
      this.screensService.handlerRegisterRoutes()
      this.appModule.start()
      resolve()
    })
  }

  static getInstance() {
    return Container.get(MainModule)
  }
}
