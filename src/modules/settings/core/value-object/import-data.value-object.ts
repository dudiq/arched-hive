import { PouchEntity } from '@pv/core/entities/pouch.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'

export type ImportDataValueObject = {
  pouch: PouchEntity[]
  category: CategoryEntity[]
  expense: ExpenseEntity[]
}
