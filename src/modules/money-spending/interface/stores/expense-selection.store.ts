import { Store } from '@pv/di'
import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'

@Store()
export class ExpenseSelectionStore {
  currentExpenseView: ExpenseViewEntity | null = null

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

  get parentCategoryId() {
    return this.currentExpenseView?.catParentId
  }

  get categoryId() {
    return this.currentExpenseView?.catId
  }
}
