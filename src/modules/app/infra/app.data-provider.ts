import { DataProvider } from '@pv/di'
import { DatabaseDataProvider } from '@pv/infra/database.data-provider'
import { CategoryEntity } from '@pv/core/entities/category.entity'

@DataProvider()
export class AppDataProvider extends DatabaseDataProvider {
  async defineCategories(categories: CategoryEntity[]) {
    await this.client.category.clear()
    await this.client.category.bulkAdd(categories)

    return this.ok()
  }
}
