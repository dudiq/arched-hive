import { Store } from '@pv/di'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { LIMIT_DEFAULT } from '../constants'

@Store()
export class MoneySpendingStore {
  offset = 0

  selectedCategoryId = ''

  isLoading = true

  expenses: ExpenseEntity[] = []

  categories: CategoryEntity[] = []

  get isShowMoreVisible() {
    return this.expenses.length > LIMIT_DEFAULT
  }

  get selectedParentCategory() {
    return this.categories.find((item) => item.catId === this.selectedCategoryId)
  }

  get selectedCategory() {
    return this.categories.find((item) => item.id === this.selectedCategoryId)
  }

  get isCalculatorVisible() {
    if (!this.selectedCategoryId) return false
    return !this.selectedParentCategory
  }

  get parentCategoryTitle() {
    if (!this.selectedCategoryId) return ''

    const category = this.selectedCategory
    if (!category) return ''
    if (!category.catId) return category.title
    if (category.catId) {
      const parentCategory = this.categories.find((item) => item.id === category.catId)
      return parentCategory?.title || ''
    }
    return ''
  }

  get visibleCategories() {
    if (this.isCalculatorVisible) {
      const selectedCategory = this.selectedCategory
      if (!selectedCategory) return []
      return [selectedCategory]
    }

    return this.categories.filter((category) => {
      if (category.catId === this.selectedCategoryId) return true
      if (!this.selectedCategoryId && !category.catId) return true
      return false
    })
  }

  get isInitialLoading() {
    return this.offset === 0 && this.isLoading
  }

  setSelectedCategoryId(id: string) {
    if (this.selectedCategoryId !== id) {
      this.selectedCategoryId = id
      return
    }

    const currentCategory = this.selectedCategory
    this.selectedCategoryId = currentCategory?.catId || ''
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

  removeExpenseById(id: string) {
    const index = this.expenses.findIndex((item) => item.id === id)
    if (index === -1) return
    this.expenses.splice(index, 1)
  }

  dropEntities() {
    this.setOffset(0)
    this.setExpenses([])
    this.setCategories([])
  }
}
