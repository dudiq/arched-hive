import { Store } from '@pv/di'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { getRangeByViewType } from '@pv/modules/analytic/interface/services/get-range-by-view-type'

@Store()
export class AnalyticStore {
  reportView: REPORT_VIEW = REPORT_VIEW.MONTHLY

  viewDate: number = Date.now()

  setReportView(value: REPORT_VIEW) {
    this.reportView = value
  }

  setViewDate(value: number) {
    this.viewDate = value
  }

  get isNextAvailable() {
    const endDate = this.range.endDate
    return endDate < Date.now()
  }

  get range() {
    return getRangeByViewType({
      viewType: this.reportView,
      initDate: this.viewDate,
    })
  }
}
