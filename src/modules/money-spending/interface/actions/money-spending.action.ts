import { Action, Inject } from '@pv/di'
import { HistoryService } from '@pv/interface/services/history.service'
import { Routes } from '@pv/constants/routes'
import { MoneySpendingService } from '../services/money-spending.service'
import { MoneySpendingStore } from '../stores/money-spending.store'

@Action()
export class MoneySpendingAction {
  constructor(
    @Inject()
    private moneySpendingService: MoneySpendingService,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
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

  handleOpenExpense() {
    this.historyService.push(Routes.expenseItem)
  }

  handleOpenExpenseList() {
    this.historyService.push(Routes.expense)
  }

  handleDropSelectedCategory() {
    this.moneySpendingStore.setSelectedCategoryId('')
  }
}
