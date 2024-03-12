import { Module } from '@repo/service'
import { startRender } from './ui/start-render'

@Module()
export class AppModule {
  start() {
    startRender()
  }
}
