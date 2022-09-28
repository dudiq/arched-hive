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

  handleSelectExpense(id: string) {
    const nextId = this.expenseSelectionStore.currentExpenseView?.id === id ? '' : id
    const expense = this.expensesViewStore.getExpenseViewById(nextId)
    if (!expense) {
      this.expenseSelectionStore.setCurrentExpenseView(null)
      return
    }

    this.moneySpendingStore.setSelectedCategoryId(expense.catId)
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
    this.expenseSelectionStore.addNumberToCost(value)
  }

  handlePushCost() {
    this.expenseSelectionStore.pushCurrentToCostList()
  }

  handleBackspaceCost() {
    this.expenseSelectionStore.backspaceCostList()
  }

  handleClear() {
    this.expenseSelectionStore.clear()
  }

  handleChangeDesc(value: string) {
    this.expenseSelectionStore.setCurrentDesc(value)
  }

  handleSetFloat() {
    this.expenseSelectionStore.setIsFloat(true)
  }

  handleApply() {
    this.moneySpendingService.handleApply()
  }

  handleUpdate() {
    this.moneySpendingService.handleUpdate()
  }
}
