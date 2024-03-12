import { DatabaseDataProvider } from '@pv/modules/database-provider'

import {DataProvider, Inject} from '@repo/service'

import type { CategoryEntity } from '@pv/modules/categories/core/category.entity'
import type { PouchId } from '@pv/modules/pouches/core/pouch.entity'

function checkDateEnd(item: CategoryEntity) {
  return !item.dateEnd
}

@DataProvider()
export class AnalyticDataProvider {
  constructor(
    private readonly databaseDataProvider = Inject(DatabaseDataProvider)
  ) {}

  async getRangeReport({
    startDate,
    endDate,
    pouchId,
  }: {
    startDate: number
    endDate: number
    pouchId: PouchId
  }) {
    const provider = this.databaseDataProvider

    const [categoryList, expenseList] = await Promise.all([
      provider.client.category.filter(checkDateEnd).toArray(),
      provider.client.expense
        .where('time')
        .between(startDate, endDate)
        .filter((item) => {
          return item.pouchId == pouchId && item.dateEnd == null
        })
        .toArray(),
    ])

    return provider.ok({
      categoryList,
      expenseList,
    })
  }
}
