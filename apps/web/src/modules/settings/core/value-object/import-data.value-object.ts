import { PouchEntity } from '@pv/pouches/core/pouch.entity'
import { CategoryEntity } from '@pv/categories/core/category.entity'
import { ExpenseEntity } from '@pv/money-spending/core/expense.entity'

export type ImportDataValueObject = {
  pouch: PouchEntity[]
  category: CategoryEntity[]
  expense: ExpenseEntity[]
}
