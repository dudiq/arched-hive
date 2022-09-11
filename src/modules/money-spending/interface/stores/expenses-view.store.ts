import { Inject, Store } from '@pv/di'
import { getMoney } from '@pv/interface/services/i18n'
import { LangStore } from '@pv/modules/language'
import { ExpenseViewListService } from '@pv/modules/view-list'
import { MoneySpendingStore } from './money-spending.store'

@Store()
export class ExpensesViewStore {
  constructor(
    @Inject()
    private langStore: LangStore,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
    @Inject()
    private expenseViewListService: ExpenseViewListService,
  ) {}

  get dateFormatter() {
    return new Intl.DateTimeFormat(this.langStore.currentLanguage, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  get dateYearFormatter() {
    return new Intl.DateTimeFormat(this.langStore.currentLanguage, {
      year: 'numeric',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  get startTime() {
    const edgeDate = new Date()
    edgeDate.setHours(0, 0, 0, 0)
    return edgeDate.getTime()
  }

  get todayCost() {
    const startTime = this.startTime
    const sum = this.moneySpendingStore.expenses.reduce((acc, expense) => {
      if (expense.time <= startTime) return acc
      return acc + expense.cost
    }, 0)
    return getMoney(sum)
  }

  get expensesView() {
    return this.expenseViewListService.mapExpenseToExpenseViewEntityList(
      this.moneySpendingStore.expenses,
      this.moneySpendingStore.categories,
    )
  }

  getExpenseViewById(id: string) {
    return this.expensesView.find((item) => item.id === id) || null
  }
}
