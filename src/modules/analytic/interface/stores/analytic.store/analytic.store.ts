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

  get isPrevAvailable() {
    return this.reportView !== REPORT_VIEW.ALL
  }

  get totalCost() {
    return this.expenseList.reduce((summ, item) => {
      return summ + item.cost
    }, 0)
  }

  // get categoryReportView() {
  //   const categorySummMap = this.expenseList.reduce((acc, expense) => {
  //     const { catId, cost } = expense
  //     acc[catId] = (acc[catId] || 0) + cost
  //     return acc
  //   }, {} as Record<string, number>)
  //
  //   this.categoryList.reduce()
  //
  //   this.categoryList
  // }

  get isNextAvailable() {
    if (this.reportView === REPORT_VIEW.ALL) return false

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
