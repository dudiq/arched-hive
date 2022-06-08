import { Inject, Store } from '@pv/di'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { PouchEntity } from '@pv/core/entities/pouch.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { LocalStorageItem } from '@pv/interface/services/local-storage-item'
import { ThemeEntity } from '@pv/modules/theme'
import { ExpenseViewService } from '@pv/interface/services/expense-view.service'
import { getMoney } from '@pv/interface/services/i18n'
import { LangStore } from '@pv/modules/language'

@Store()
export class MoneySpendingStore {
  private pouchLocalStorage = new LocalStorageItem<ThemeEntity>('pouch')

  offset = 0

  isLoading = true

  expenses: ExpenseEntity[] = []

  pouches: PouchEntity[] = []

  categories: CategoryEntity[] = []

  constructor(
    @Inject()
    private expenseViewService: ExpenseViewService,
    @Inject()
    private langStore: LangStore,
  ) {}

  get isInitialLoading() {
    return this.offset === 0 && this.isLoading
  }

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
    const sum = this.expenses.reduce((acc, expense) => {
      if (expense.time <= startTime) return acc
      return acc + expense.cost
    }, 0)
    return getMoney(sum)
  }

  get currentPouch() {
    const pouchId = this.pouchLocalStorage.value
    if (!pouchId) return undefined
    return this.pouches.find(({ id }) => pouchId === id)
  }

  get expensesView() {
    return this.expenseViewService.getExpenseViewList(this.expenses, this.categories)
  }

  getExpenseViewById(id: string) {
    return this.expensesView.find((item) => item.id === id) || null
  }

  setIsLoading(value: boolean) {
    this.isLoading = value
  }

  setOffset(offset: number) {
    this.offset = offset
  }

  setExpenses(value: ExpenseEntity[]) {
    this.expenses = value
  }

  addExpenses(value: ExpenseEntity[]) {
    this.expenses = [...this.expenses, ...value]
  }

  setCategories(value: CategoryEntity[]) {
    this.categories = value
  }

  setPouches(value: PouchEntity[]) {
    this.pouches = value
  }

  removeExpenseById(id: string) {
    const index = this.expenses.findIndex((item) => item.id === id)
    if (index === -1) return
    this.expenses.splice(index, 1)
  }

  dropEntities() {
    this.setOffset(0)
    this.setExpenses([])
    this.setCategories([])
    this.setPouches([])
  }
}
