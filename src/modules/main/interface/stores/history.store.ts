import { Store } from '@pv/di'

@Store()
export class HistoryStore {
  pathname = ''

  updateState(pathname: string) {
    if (pathname !== this.pathname) {
      this.pathname = pathname
    }
  }
}
