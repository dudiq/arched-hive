import { Store } from '@pv/di'
import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'

@Store()
export class ExpenseSelectionStore {
  currentExpenseView: ExpenseViewEntity | null = null

  costList: number[] = []

  currentCost = 0

  currentDesc = ''

  setCurrentCost(value: number) {
    this.currentCost = value
  }

  setCurrentDesc(value: string) {
    this.currentDesc = value
  }

  pushCurrentToCostList() {
    this.costList.push(this.currentCost)
    this.currentCost = 0
  }

  removeLastFromCostList() {
    this.costList.pop()
  }

  setCurrentExpenseView(value: ExpenseViewEntity | null) {
    this.currentExpenseView = value
      ? {
          ...value,
        }
      : null
  }

  get isEditing() {
    return !!this.currentExpenseView
  }

  get categoryId() {
    return this.currentExpenseView?.catId
  }
}
