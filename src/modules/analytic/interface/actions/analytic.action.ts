import { Action, Inject } from '@pv/di'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { AnalyticReportService } from '@pv/modules/analytic/interface/services/analytic-report.service'
import { AnalyticStore } from '../stores/analytic.store'

@Action()
export class AnalyticAction {
  constructor(
    @Inject()
    private analyticReportService: AnalyticReportService,
    @Inject()
    private analyticStore: AnalyticStore,
  ) {}

  async handleChangeReportView(reportView: REPORT_VIEW) {
    this.analyticStore.setIsLoading(true)
    this.analyticStore.setReportView(reportView)
    await this.analyticReportService.handleReport()
    this.analyticStore.setIsLoading(false)
  }

  async handleNextReport() {
    const isNextAvailable = this.analyticStore.isNextAvailable
    if (!isNextAvailable) return
    this.analyticStore.setIsLoading(true)
    this.analyticStore.setViewDate(this.analyticStore.range.endDate + 2000)
    await this.analyticReportService.handleReport()
    this.analyticStore.setIsLoading(false)
  }

  async handlePrevReport() {
    this.analyticStore.setIsLoading(true)
    this.analyticStore.setViewDate(this.analyticStore.range.startDate - 2000)
    await this.analyticReportService.handleReport()
    this.analyticStore.setIsLoading(false)
  }
}
