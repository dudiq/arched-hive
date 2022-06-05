import { PouchEntity } from '@pv/core/entities/pouch.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'

export type ExportDbValueObject = {
  dbVersion: number
  stats: {
    expenses: number
    cats: number
    pouch: number
  }
  data: {
    pouch: PouchEntity[]
    category: CategoryEntity[]
    expense: ExpenseEntity[]
  }
}
