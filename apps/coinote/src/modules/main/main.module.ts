import { AppModule } from '@pv/modules/app'

import { Inject } from '@repo/service'

import { ScreensService } from './interface/services/screens.service'

export class MainModule {
  constructor(
    private screensService = Inject(ScreensService),
    private appModule = Inject(AppModule),
  ) {}

  async start() {
    return new Promise<void>((resolve) => {
      this.screensService.handlerRegisterRoutes()
      this.appModule.start()
      resolve()
    })
  }

  static getInstance() {
    return Inject(MainModule)
  }
}
