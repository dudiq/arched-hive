import { Module, Container } from '@pv/di'
import { startRender } from './start-render'

@Module()
export class MainModule {
  async start() {
    return new Promise<void>((resolve) => {
      startRender()
      resolve()
    })
  }

  static getInstance() {
    return Container.get(MainModule)
  }
}
