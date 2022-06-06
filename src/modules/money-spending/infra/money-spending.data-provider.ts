import { DataProvider } from '@pv/di'
import { DatabaseDataProvider } from '@pv/infra/database.data-provider'

type GetExpensesType = {
  pouchId?: string
  offset: number
  limit: number
}

@DataProvider()
export class MoneySpendingDataProvider extends DatabaseDataProvider {
  async getExpenses({ offset, pouchId, limit }: GetExpensesType) {
    const expenses = await this.client.expense
      .orderBy('time')
      .reverse()
      .filter((item) => {
        if (!item.dateEnd) return true
        if (pouchId && item.pouchId !== pouchId) return true
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
}
