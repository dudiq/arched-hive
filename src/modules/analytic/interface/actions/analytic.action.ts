import { Action, Inject } from '@pv/di'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { AnalyticReportService } from '@pv/modules/analytic/interface/services/analytic-report.service'
import { PouchService } from '@pv/modules/pouches'
import { AnalyticStore } from '../stores/analytic.store'

@Action()
export class AnalyticAction {
  constructor(
    @Inject()
    private analyticReportService: AnalyticReportService,
    @Inject()
    private analyticStore: AnalyticStore,
    @Inject()
    private pouchService: PouchService,
  ) {}

  handleToggleSelectedCategory(selectedId: string) {
    if (this.analyticStore.selectedCategoryId === selectedId) {
      this.analyticStore.setSelectedCategory('')
      return
    }
    this.analyticStore.setSelectedCategory(selectedId)
  }

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

  async initialLoadData() {
    this.analyticStore.setIsLoading(true)
    await this.pouchService.loadPouches()
    await this.analyticReportService.handleReport()
    this.analyticStore.setIsLoading(false)
  }

  async reloadAnalytic() {
    this.analyticStore.setIsLoading(true)
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
