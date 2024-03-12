import { Routes } from '@pv/route/interface/routes'
import { HistoryService } from '@pv/history/interface/history.service'
import { t } from '@pv/i18n'
import { MessageBoxService } from '@pv/message-box'
import { MoneySpendingAdapter } from '@pv/money-spending/infra/money-spending.adapter'
import { ExpenseSelectionStore } from '@pv/money-spending/interface/stores/expense-selection.store'
import { MoneySpendingStore } from '@pv/money-spending/interface/stores/money-spending.store'
import { PouchService, PouchStore } from '@pv/pouches'

import { isErr } from '@repo/result'
import { Inject, Service } from '@repo/service'

import { LIMIT_DEFAULT } from '../constants'

@Service()
export class MoneySpendingService {
  constructor(
    private messageBoxService= Inject(MessageBoxService),
    private moneySpendingStore= Inject(MoneySpendingStore),
    private moneySpendingAdapter= Inject(MoneySpendingAdapter),
    private expenseSelectionStore= Inject(ExpenseSelectionStore),
    private pouchService= Inject(PouchService),
    private pouchStore= Inject(PouchStore),
    private historyService= Inject(HistoryService),
  ) {}

  async initialLoadData() {
    this.moneySpendingStore.setExpenses([])
    this.moneySpendingStore.setOffset(0)

    const [categoriesResult] = await Promise.all([
      this.moneySpendingAdapter.getCategories(),
      this.pouchService.loadPouches(),
    ])

    if (isErr(categoriesResult)) {
      // TODO: add error processing
      return
    }

    this.moneySpendingStore.setCategories(categoriesResult.data)
    if (this.moneySpendingStore.categories.length === 0) {
      // open empty settings
      this.historyService.push(Routes.empty)
      return
    }

    await this.loadExpenses(0)
  }

  async reloadExpenses() {
    this.moneySpendingStore.setExpenses([])
    this.moneySpendingStore.setOffset(0)
    await this.loadExpenses(0)
  }

  async loadExpenses(offset: number) {
    const currentPouchId = this.pouchStore.currentPouchId

    const result = await this.moneySpendingAdapter.getExpenses({
      offset,
      pouchId: currentPouchId,
      limit: LIMIT_DEFAULT,
    })

    if (isErr(result)) {
      // TODO: add error
      return
    }

    this.moneySpendingStore.setOffset(offset + LIMIT_DEFAULT)
    const nextExpenses = result.data
    this.moneySpendingStore.addExpenses(nextExpenses)
  }

  async removeExpense(id: string) {
    const isConfirmed = await this.messageBoxService.confirm(t('expense.confirmRemove'))
    if (!isConfirmed) return

    this.moneySpendingStore.setIsLoading(true)
    const result = await this.moneySpendingAdapter.removeExpense(id)
    this.moneySpendingStore.setIsLoading(false)
    if (isErr(result)) {
      // TODO: add error processing
      return
    }

    this.moneySpendingStore.setOffset(this.moneySpendingStore.offset - 1)
    this.moneySpendingStore.removeExpenseById(id)
    this.expenseSelectionStore.dropData()
  }

  async handleUpdate() {
    const expenseView = this.expenseSelectionStore.currentExpenseView
    if (!expenseView) return

    this.moneySpendingStore.setIsLoading(true)
    const pouchId = this.pouchStore.currentPouchId

    await this.moneySpendingAdapter.updateExpense({
      id: expenseView.id,
      time: expenseView.time,
      pouchId,
      catId: this.moneySpendingStore.selectedCategoryId,
      cost: this.expenseSelectionStore.costValue,
      desc: this.expenseSelectionStore.currentDesc,
    })

    this.expenseSelectionStore.dropData()

    await this.reloadExpenses()

    this.historyService.push(Routes.expense)

    this.moneySpendingStore.setIsLoading(false)
  }

  async handleApply() {
    this.moneySpendingStore.setIsLoading(true)

    const pouchId = this.pouchStore.currentPouchId
    const catId = this.moneySpendingStore.selectedCategoryId
    const desc = this.expenseSelectionStore.currentDesc

    const newExpenses = this.expenseSelectionStore.getExpenses()
    // console.log('newExpenses', newExpenses)

    for (const cost of newExpenses) {
      await this.moneySpendingAdapter.addExpense({
        pouchId,
        catId,
        cost,
        desc,
      })
      // if (isErr(result)) {
      //   //TODO: add error processing
      //   return
      // }
    }
    this.expenseSelectionStore.dropData()

    await this.reloadExpenses()

    this.historyService.push(Routes.expense)
    // await this.initialLoadData()
    this.moneySpendingStore.setIsLoading(false)
  }
}
