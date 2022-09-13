import { Inject, Store } from '@pv/di'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { ExpenseViewListService } from '@pv/modules/view-list'
import { getRangeByViewType } from './get-range-by-view-type'

type Category = {
  id: string
  title: string
  cost: number
}

type CategoryMap = Record<
  string,
  {
    node: Category
    children: Record<string, Category>
  }
>

@Store()
export class AnalyticStore {
  reportView: REPORT_VIEW = REPORT_VIEW.MONTHLY

  expenseList: ExpenseEntity[] = []

  categoryList: CategoryEntity[] = []

  viewDate: number = Date.now()

  isLoading = false

  selectedCategoryId = ''

  constructor(
    @Inject()
    private expenseViewListService: ExpenseViewListService,
  ) {}

  setSelectedCategory(value: string) {
    this.selectedCategoryId = value
  }

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
    return this.expenseList.reduce((sum, item) => {
      return sum + Number(item.cost)
    }, 0)
  }

  get categoryMap() {
    return this.categoryList.reduce((acc, category) => {
      acc[category.id] = category
      return acc
    }, {} as Record<string, CategoryEntity>)
  }

  get categoryReportView() {
    return Object.values(this.categoryReportViewMap).map((category) => {
      return {
        node: category.node,
        children: Object.values(category.children),
      }
    })
  }

  get expenseListView() {
    const categoryMap = this.categoryMap
    const expenses = this.expenseList.filter((expense) => {
      const parentCatId = categoryMap[expense.catId].catId
      if (!this.checkCategorySelection(expense.catId, parentCatId)) return false
      return true
    })
    return this.expenseViewListService.mapExpenseToExpenseViewEntityList(
      expenses,
      this.categoryList,
    )
  }

  private checkCategorySelection(catId: string, parentCatId?: string) {
    const selectedCategoryId = this.selectedCategoryId
    if (!selectedCategoryId) return true
    if (selectedCategoryId) {
      const isSelected = selectedCategoryId === parentCatId || selectedCategoryId === catId
      if (!isSelected) return false
    }
    return true
  }

  get categoryReportViewMap() {
    const categoryMap = this.categoryMap

    return this.expenseList.reduce((acc, expense) => {
      const { catId, cost } = expense
      const parentCatId = categoryMap[catId].catId

      if (!this.checkCategorySelection(catId, parentCatId)) {
        return acc
      }

      if (parentCatId) {
        const parentNode = (acc[parentCatId] = acc[parentCatId] || {
          node: {
            id: parentCatId,
            title: categoryMap[parentCatId].title,
            cost: 0,
          },
          children: {},
        })
        parentNode.node.cost = parentNode.node.cost + Number(cost)
        const catNode = (parentNode.children[catId] = parentNode.children[catId] || {
          id: catId,
          cost: 0,
          title: categoryMap[catId].title,
        })
        catNode.cost = catNode.cost + Number(cost)
        return acc
      }

      const item = (acc[catId] = acc[catId] || {
        node: {
          id: catId,
          cost: 0,
          title: categoryMap[catId].title,
        },
        children: {},
      })

      item.node.cost = item.node.cost + Number(cost)
      return acc
    }, {} as CategoryMap)
  }

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
