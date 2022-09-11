import { Store } from '@pv/di'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { getRangeByViewType } from './get-range-by-view-type'

@Store()
export class AnalyticStore {
  reportView: REPORT_VIEW = REPORT_VIEW.MONTHLY

  expenseList: ExpenseEntity[] = []
  categoryList: CategoryEntity[] = []

  viewDate: number = Date.now()

  isLoading = false

  setExpenseList(value: ExpenseEntity[]) {
    this.expenseList = value
  }

  setCategoryList(value: CategoryEntity[]) {
    this.categoryList = value
  }

  setIsLoading(value: boolean) {
    this.isLoading = value
  }

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
      viewDate: this.viewDate,
    })
  }
}
