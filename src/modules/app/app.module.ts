import { Module } from '@pv/di'
import { startRender } from './ui/start-render'

@Module()
export class AppModule {
  start() {
    startRender()
  }
}
