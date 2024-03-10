import { DatabaseDataProvider } from '@pv/modules/database-provider'

import {DataProvider, Inject} from '@repo/service'

import type { CategoryEntity } from '@pv/modules/categories/core/category.entity'

@DataProvider()
export class AppDataProvider {
  constructor(
    private readonly databaseDataProvider = Inject(DatabaseDataProvider)
  ) {}

  async defineCategories(categories: CategoryEntity[]) {
    await this.databaseDataProvider.client.category.clear()
    await this.databaseDataProvider.client.category.bulkAdd(categories)

    return this.databaseDataProvider.ok(true)
  }
}
