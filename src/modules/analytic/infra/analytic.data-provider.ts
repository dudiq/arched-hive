import { DataProvider } from '@pv/di'
import { DatabaseDataProvider } from '@pv/infra/database.data-provider'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { PouchId } from '@pv/core/entities/pouch.entity'

function checkDateEnd(item: CategoryEntity) {
  return !item.dateEnd
}

@DataProvider()
export class AnalyticDataProvider extends DatabaseDataProvider {
  async getRangeReport({
    startDate,
    endDate,
    pouchId,
  }: {
    startDate: number
    endDate: number
    pouchId: PouchId
  }) {
    const [categoryList, expenseList] = await Promise.all([
      this.client.category.filter(checkDateEnd).toArray(),
      this.client.expense
        .where('time')
        .between(startDate, endDate)
        .filter((item) => {
          return item.pouchId == pouchId && item.dateEnd == null
        })
        .toArray(),
    ])

    return this.ok({
      categoryList,
      expenseList,
    })
  }
}
