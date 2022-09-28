import { Store } from '@pv/di'
import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'
import { getNumber } from 'jr-translate'

@Store()
export class ExpenseSelectionStore {
  currentExpenseView: ExpenseViewEntity | null = null

  currentDesc = ''

  private totalCostList: number[] = []

  private currentCostList: number[] = []

  private currentDivideCostList: number[] = []

  private isFloat = false

  clear() {
    this.currentCostList = []
    this.currentDivideCostList = []
    this.totalCostList = []
    this.setIsFloat(false)
  }

  setIsFloat(value: boolean) {
    this.isFloat = value
  }

  addNumberToCost(char: string) {
    const value = Number(char)
    if (isNaN(value)) return

    if (!this.isFloat) {
      this.currentCostList.push(value)
      return
    }

    this.currentDivideCostList.push(value)
    if (this.currentDivideCostList.length > 2) {
      this.currentDivideCostList.shift()
    }
  }

  setCurrentDesc(value: string) {
    this.currentDesc = value
  }

  get costValue() {
    const cost =
      Number(this.currentCostList.join('')) * 100 + Number(this.currentDivideCostList.join(''))
    return cost
  }

  pushCurrentToCostList() {
    const cost = this.costValue
    this.totalCostList.push(cost)
    this.currentCostList = []
    this.currentDivideCostList = []
    this.setIsFloat(false)
  }

  backspaceCostList() {
    if (this.currentDivideCostList.length) {
      this.currentDivideCostList.pop()
      return
    }

    this.setIsFloat(false)

    this.currentCostList.pop()
  }

  setCurrentExpenseView(value: ExpenseViewEntity | null) {
    this.currentExpenseView = value
      ? {
          ...value,
        }
      : null

    if (value) {
      this.setCurrentDesc(value.desc || '')
      const numbers = String(value.cost)
        .split('')
        .map((num) => Number(num))
      this.currentDivideCostList = numbers.slice(-2)
      this.currentCostList = numbers.slice(0, -2)
    }
  }

  get isEditing() {
    return !!this.currentExpenseView
  }

  get categoryId() {
    return this.currentExpenseView?.catId
  }

  get costsView() {
    return this.totalCostList.map((item) => getNumber(item / 100, 2)).join(' + ')
  }

  get totalCostView() {
    const total = this.totalCostList.reduce((acc, item) => {
      return acc + item
    }, this.costValue)
    return getNumber(total / 100)
  }

  get currentCostView() {
    const num = this.costValue / 100

    if (this.isFloat) {
      return getNumber(num, 2)
    }

    return getNumber(num)
  }

  getExpenses() {
    return [...this.totalCostList, this.costValue]
  }

  dropData() {
    this.totalCostList = []
    this.currentCostList = []
    this.currentDivideCostList = []
    this.isFloat = false
    this.currentDesc = ''
  }
}
