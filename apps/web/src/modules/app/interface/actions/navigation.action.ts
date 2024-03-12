import { Action, Inject } from '@repo/service'
import { HistoryService } from '@pv/history/interface/history.service'

@Action()
export class NavigationAction {
  constructor(
    private readonly historyService = Inject(HistoryService),
  ) {}

  handleChangePage(nextPage: string) {
    this.historyService.push(nextPage)
  }
}
