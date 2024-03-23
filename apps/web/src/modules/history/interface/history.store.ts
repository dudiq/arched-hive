import { Store } from '@repo/service'

@Store()
export class HistoryStore {
  pathname = ''

  updateState(pathname: string) {
    if (pathname !== this.pathname) {
      this.pathname = pathname
    }
  }
}
