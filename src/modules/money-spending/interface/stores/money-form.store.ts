import { Store } from '@pv/di'
import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'

@Store()
export class MoneyFormStore {
  currentExpenseView: ExpenseViewEntity | null = null

  setCurrentExpenseView(value: ExpenseViewEntity | null) {
    this.currentExpenseView = value
  }

  get isEditing() {
    return !!this.currentExpenseView
  }
}
