import { Action, Inject } from '@pv/di'
import { MoneySpendingService } from '../services/money-spending.service'
import { MoneySpendingStore } from '../stores/money-spending.store'
import { ExpenseSelectionStore } from '../stores/expense-selection.store'
import { ExpensesViewStore } from '../stores/expenses-view.store'

@Action()
export class ExpenseSelectionAction {
  constructor(
    @Inject()
    private moneySpendingService: MoneySpendingService,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
    @Inject()
    private expenseSelectionStore: ExpenseSelectionStore,
    @Inject()
    private expensesViewStore: ExpensesViewStore,
  ) {}

  handleToggleSelectedExpense(id: string) {
    const nextId = this.expenseSelectionStore.currentExpenseView?.id === id ? '' : id
    if (!nextId) {
      this.expenseSelectionStore.setCurrentExpenseView(null)
      return
    }
    const expense = this.expensesViewStore.getExpenseViewById(nextId)
    this.expenseSelectionStore.setCurrentExpenseView(expense)
  }

  async handleRemoveExpense() {
    const id = this.expenseSelectionStore.currentExpenseView?.id
    if (!id) return
    await this.moneySpendingService.removeExpense(id)
  }

  handleSelectCategoryId(id: string) {
    this.moneySpendingStore.setSelectedCategoryId(id)
  }

  handleDropSelectedCategory() {
    this.moneySpendingStore.setSelectedCategoryId('')
  }

  handleAddNumber(value: string) {
    const currentCost = this.expenseSelectionStore.currentCost
    const nextCost = currentCost * 10 + Number(value)
    this.expenseSelectionStore.setCurrentCost(nextCost)
  }

  handleChangeCost(value: string) {
    this.expenseSelectionStore.setCurrentCost(Number(value))
  }

  handlePushCost() {
    this.expenseSelectionStore.pushCurrentToCostList()
  }

  handlePopCost() {
    this.expenseSelectionStore.removeLastFromCostList()
  }

  handleClear() {
    this.expenseSelectionStore.clear()
  }

  handleChangeDesc(value: string) {
    this.expenseSelectionStore.setCurrentDesc(value)
  }

  handleSetFloat() {}

  handleApply() {}
}
