import { Routes } from '@pv/route/interface/routes'
import { HistoryService } from '@pv/history/interface/history.service'

import { Action, Inject } from '@repo/service'

import { MoneySpendingService } from '../services/money-spending.service'
import { MoneySpendingStore } from '../stores/money-spending.store'

@Action()
export class MoneySpendingAction {
  constructor(
    private moneySpendingService = Inject(MoneySpendingService),
    private moneySpendingStore = Inject(MoneySpendingStore),
    private historyService = Inject(HistoryService),
  ) {}

  async initialLoadData() {
    if (this.moneySpendingStore.offset !== 0) return
    this.moneySpendingStore.setIsLoading(true)
    await this.moneySpendingService.initialLoadData()
    this.moneySpendingStore.setIsLoading(false)
  }

  async reloadExpenses() {
    this.moneySpendingStore.setIsLoading(true)
    await this.moneySpendingService.reloadExpenses()
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
