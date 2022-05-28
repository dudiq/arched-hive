import { Inject, Service } from '@pv/di'
import { RouterHistory } from './router-history'

@Service()
export class HistoryService {
  constructor(
    @Inject()
    private routerHistory: RouterHistory,
  ) {}

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
