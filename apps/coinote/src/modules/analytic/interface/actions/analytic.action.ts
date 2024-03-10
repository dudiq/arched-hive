import { AnalyticReportService } from '@pv/modules/analytic/interface/services/analytic-report.service'
import { PouchService } from '@pv/modules/pouches'

import { Action, Inject } from '@repo/service'

import { AnalyticStore } from '../stores/analytic.store'

import type { REPORT_VIEW } from '@pv/modules/analytic/core/constants'

@Action()
export class AnalyticAction {
  constructor(
    private readonly analyticReportService = Inject(AnalyticReportService),
    private readonly analyticStore = Inject(AnalyticStore),
    private readonly pouchService = Inject(PouchService),
  ) {}

  handleToggleSelectedCategory(selectedId?: string) {
    if (!selectedId) return;
    if (this.analyticStore.selectedCategoryId === selectedId) {
      this.analyticStore.setSelectedCategory('')
      return
    }
    this.analyticStore.setSelectedCategory(selectedId)
  }

  async handleChangeReportView(reportView: REPORT_VIEW) {
    this.analyticStore.lists.start()

    this.analyticStore.setReportView(reportView)
    await this.analyticReportService.handleReport()
    this.analyticStore.lists.finish()
  }

  async handleNextReport() {
    const isNextAvailable = this.analyticStore.isNextAvailable
    if (!isNextAvailable) return

    this.analyticStore.lists.start()
    this.analyticStore.setViewDate(this.analyticStore.range.endDate + 2000)
    await this.analyticReportService.handleReport()
    this.analyticStore.lists.finish()
  }

  async initialLoadData() {
    this.analyticStore.lists.start()
    await this.pouchService.loadPouches()
    await this.analyticReportService.handleReport()
    this.analyticStore.lists.finish()
  }

  async reloadAnalytic() {
    await this.analyticReportService.handleReport()
  }

  async handlePrevReport() {
    this.analyticStore.lists.start()
    this.analyticStore.setViewDate(this.analyticStore.range.startDate - 2000)
    await this.analyticReportService.handleReport()
    this.analyticStore.lists.finish()
  }
}
