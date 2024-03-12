import { PouchEntity } from '@pv/modules/pouches/core/pouch.entity'
import { CategoryEntity } from '@pv/modules/categories/core/category.entity'
import { ExpenseEntity } from '@pv/modules/money-spending/core/expense.entity'

export type ImportDataValueObject = {
  pouch: PouchEntity[]
  category: CategoryEntity[]
  expense: ExpenseEntity[]
}
