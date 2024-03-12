import { Inject, Service } from '@repo/service'

import { RouterHistory } from './router-history'

@Service()
export class HistoryService {
  constructor(private routerHistory = Inject(RouterHistory)) {}

  push(route: string) {
    const history = this.routerHistory.history
    if (!history) return
    history(route)
  }

  replace(route: string) {
    const history = this.routerHistory.history
    if (!history) return
    history(route, { replace: true })
  }
}
