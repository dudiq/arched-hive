import { Inject, Store } from '@pv/di'
import { getMoney } from '@pv/interface/services/i18n'
import { LangStore } from '@pv/modules/language'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'
import { MoneySpendingStore } from './money-spending.store'

@Store()
export class ExpensesViewStore {
  constructor(
    @Inject()
    private langStore: LangStore,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
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
    return this.mapExpenseToExpenseViewEntityList(
      this.moneySpendingStore.expenses,
      this.moneySpendingStore.categories,
    )
  }

  mapExpenseToExpenseViewEntityList(
    expenseList: ExpenseEntity[],
    categoryList: CategoryEntity[],
  ): ExpenseViewEntity[] {
    const categoryMap: Record<string, CategoryEntity> = {}

    categoryList.forEach((item) => {
      categoryMap[item.id] = item
    })

    return expenseList.map((expenseItem) => {
      const catId = expenseItem.catId
      const cat = categoryMap[catId]
      const parentCat = cat && cat.catId ? categoryMap[cat.catId] : null
      return {
        id: expenseItem.id,
        catId: expenseItem.catId,
        cost: expenseItem.cost,
        pouchId: expenseItem.pouchId,
        time: expenseItem.time,
        state: expenseItem.state,
        dateBegin: expenseItem.dateBegin,
        dateEnd: expenseItem.dateEnd,
        desc: expenseItem.desc,
        catParentTitle: parentCat ? parentCat.title : '',
        catParentId: parentCat?.id,
        catTitle: cat ? cat.title : '',
      }
    })
  }

  getExpenseViewById(id: string) {
    return this.expensesView.find((item) => item.id === id) || null
  }
}
