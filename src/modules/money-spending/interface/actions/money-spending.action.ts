import { Action, Inject } from '@pv/di'
import { MoneySpendingService } from '../services/money-spending.service'
import { MoneySpendingStore } from '../stores/money-spending.store'
import { MoneyFormStore } from '../stores/money-form.store'

@Action()
export class MoneySpendingAction {
  constructor(
    @Inject()
    private moneySpendingService: MoneySpendingService,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
    @Inject()
    private moneyFormStore: MoneyFormStore,
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
    const expense = this.moneySpendingStore.getExpenseViewById(nextId)
    this.moneyFormStore.setCurrentExpenseView(expense)
  }
}
