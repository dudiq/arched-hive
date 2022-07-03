import { Store } from '@pv/di'
import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'
import { getNumber } from 'jr-translate'

@Store()
export class ExpenseSelectionStore {
  currentExpenseView: ExpenseViewEntity | null = null

  costList: number[] = []

  currentCost = 0

  isFloat = false

  floatCost = 0

  currentDesc = ''

  clear() {
    this.currentCost = 0
    this.costList = []
    this.setFloat(false)
  }

  setFloat(value: boolean) {
    this.isFloat = value
    this.floatCost = 0
  }

  setFloatCost(value: number) {
    if (value < 100) {
      this.floatCost = value
      return
    }
    const str = String(value).slice(-2)
    this.floatCost = Number(str)
  }

  getNextCost(current: number, char: string) {
    return current * 10 + Number(char)
  }

  addNumberToCost(char: string) {
    if (this.isFloat) {
      const floatCost = this.getNextCost(this.floatCost, char)
      this.setFloatCost(floatCost)
      return
    }

    const cost = this.getNextCost(this.currentCost, char)
    this.setCurrentCost(cost)
  }

  setCurrentCost(value: number) {
    this.currentCost = value
  }

  setCurrentDesc(value: string) {
    this.currentDesc = value
  }

  pushCurrentToCostList() {
    this.costList.push(this.currentCost * 100 + this.floatCost)
    this.currentCost = 0
    this.setFloat(false)
  }

  removeLastFromCostList() {
    this.costList.pop()
    this.setFloat(false)
  }

  setCurrentExpenseView(value: ExpenseViewEntity | null) {
    this.currentExpenseView = value
      ? {
          ...value,
        }
      : null
  }

  get isEditing() {
    return !!this.currentExpenseView
  }

  get categoryId() {
    return this.currentExpenseView?.catId
  }

  get costsView() {
    return this.costList.map((item) => getNumber(item / 100, 2)).join(' + ')
  }

  get totalCostView() {
    const total = this.costList.reduce((acc, item) => {
      return acc + item
    }, this.currentCost * 100 + this.floatCost)
    return getNumber(total / 100)
  }

  get currentCostView() {
    if (this.isFloat) {
      const num = ((this.currentCost * 100 + this.floatCost) * 10) / 1000 + 0.0001
      return getNumber(num, 2)
    }

    return getNumber(this.currentCost)
  }

  getExpenses() {
    return [...this.costList, this.currentCost * 100 + this.floatCost]
  }

  dropData() {
    this.costList = []
    this.currentCost = 0
    this.isFloat = false
    this.floatCost = 0
    this.currentDesc = ''
  }
}
