import { Action, Inject } from '@pv/di'
import { HistoryService } from '@pv/interface/services/history.service'

@Action()
export class NavigationAction {
  constructor(
    @Inject()
    private readonly historyService: HistoryService,
  ) {}

  handleChangePage(nextPage: string) {
    this.historyService.push(nextPage)
  }
}
