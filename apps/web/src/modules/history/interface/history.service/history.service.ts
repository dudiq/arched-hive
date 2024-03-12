import { Inject, Service } from '@repo/service'

import { RouterHistory } from './router-history'

@Service()
export class HistoryService {
  constructor(private routerHistory = Inject(RouterHistory)) {}

  push(route: string): void {
    this.routerHistory.history(route)
  }

  replace(route: string): void {
    this.routerHistory.history(route, {replace: true})
  }
}
