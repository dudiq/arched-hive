import { Action, Inject } from '@pv/di'
import { HistoryService } from '@pv/interface/services/history.service'
import { Routes } from '@pv/contants/routes'
import { MoneySpendingService } from '../services/money-spending.service'
import { MoneySpendingStore } from '../stores/money-spending.store'
import { MoneyFormStore } from '../stores/money-form.store'
import { ExpensesViewStore } from '../stores/expenses-view.store'

@Action()
export class MoneySpendingAction {
  constructor(
    @Inject()
    private moneySpendingService: MoneySpendingService,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
    @Inject()
    private moneyFormStore: MoneyFormStore,
    @Inject()
    private expensesViewStore: ExpensesViewStore,
    @Inject()
    private historyService: HistoryService,
  ) {}

  async initialLoadData() {
    if (this.moneySpendingStore.offset !== 0) return
    this.moneySpendingStore.setIsLoading(true)
    await this.moneySpendingService.initialLoadData()
    this.moneySpendingStore.setIsLoading(false)
  }

  async handleLoadNextExpenses() {
    this.moneySpendingStore.setIsLoading(true)
    await this.moneySpendingService.loadExpenses(this.moneySpendingStore.offset)
    this.moneySpendingStore.setIsLoading(false)
  }

  handleToggleSelectedExpense(id: string) {
    const nextId = this.moneyFormStore.currentExpenseView?.id === id ? '' : id
    if (!nextId) {
      this.moneyFormStore.setCurrentExpenseView(null)
      return
    }
    const expense = this.expensesViewStore.getExpenseViewById(nextId)
    this.moneyFormStore.setCurrentExpenseView(expense)
  }

  handleOpenExpense() {
    this.historyService.push(Routes.expenseItem)
  }

  async handleRemoveExpense() {
    const id = this.moneyFormStore.currentExpenseView?.id
    if (!id) return
    await this.moneySpendingService.removeExpense(id)
  }

  handleOpenExpenseList() {
    this.historyService.push(Routes.expense)
  }

  handleSelectCategoryId(id: string) {
    this.moneySpendingStore.setSelectedCategoryId(id)
  }

  handleDropSelectedCategory() {
    this.moneySpendingStore.setSelectedCategoryId('')
  }
}
