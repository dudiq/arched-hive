import { DatabaseDataProvider } from '@pv/modules/database-provider'

import {DataProvider, Inject} from '@repo/service'

import type { ExpenseEntity } from '@pv/modules/money-spending/core/expense.entity'
import type { PouchId } from '@pv/modules/pouches/core/pouch.entity'

type GetExpensesType = {
  pouchId: PouchId
  offset: number
  limit: number
}

@DataProvider()
export class MoneySpendingDataProvider {
  constructor(
    private readonly databaseDataProvider = Inject(DatabaseDataProvider)
  ) {}

  get client() {
    return this.databaseDataProvider.client
  }

  get ok() {
    return this.databaseDataProvider.ok
  }

  async getExpenses({ offset, pouchId, limit }: GetExpensesType) {
    const expenses = await this.client.expense
      .orderBy('time')
      .reverse()
      .filter((item) => {
        if (item.dateEnd) return false
        if (!pouchId && !item.pouchId) return true
        if (item.pouchId === pouchId) return true
        return false
      })
      .offset(offset)
      .limit(limit)
      .toArray()

    return this.ok(expenses)
  }

  async getCategories() {
    const categories = await this.client.category.toArray()
    return this.ok(categories)
  }

  async removeExpense(id: string) {
    const fields = {
      dateEnd: Date.now(),
    }
    const result = this.client.expense.where('id').equals(id).modify(fields)

    return this.ok(result)
  }

  async addExpense(expense: ExpenseEntity) {
    this.client.expense.add(expense)
    return this.ok(true)
  }

  async updateExpense(expense: ExpenseEntity) {
    const result = this.client.expense.where('id').equals(expense.id).modify(expense)

    return this.ok(result)
  }
}
