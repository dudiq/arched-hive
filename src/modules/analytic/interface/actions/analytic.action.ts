import { Action, Inject } from '@pv/di'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { AnalyticStore } from '../stores/analytic.store'

@Action()
export class AnalyticAction {
  constructor(
    @Inject()
    private analyticStore: AnalyticStore,
  ) {}

  handleChangeReportView(reportView: REPORT_VIEW) {
    this.analyticStore.setReportView(reportView)
  }

  handleNextReport() {}
}
