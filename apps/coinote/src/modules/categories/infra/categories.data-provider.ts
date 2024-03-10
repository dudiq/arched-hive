import { DatabaseDataProvider } from '@pv/modules/database-provider'

import {DataProvider, Inject} from '@repo/service'

import type { CategoryEntity } from '@pv/modules/categories/core/category.entity'

function checkDateEnd(item: CategoryEntity) {
  return !item.dateEnd
}

@DataProvider()
export class CategoriesDataProvider {
  constructor(
    private readonly databaseDataProvider = Inject(DatabaseDataProvider)
  ) {}
  get client() {
    return this.databaseDataProvider.client
  }

  get ok() {
    return this.databaseDataProvider.ok
  }

  async addCategory(category: CategoryEntity) {
    const result = await this.client.category.add(category)

    return this.ok(result)
  }

  async getCategories() {
    const result = await this.client.category.filter(checkDateEnd).toArray()
    return this.ok(result)
  }

  async updateCategoryTitle(id: string, title: string) {
    const fields = {
      title,
    }

    const result = await this.client.category.where('id').equals(id).modify(fields)
    return this.ok(result)
  }

  async removeCategory(id: string) {
    const fields = {
      dateEnd: Date.now(),
    }

    const result = await this.client.category.where('id').equals(id).modify(fields)
    return this.ok(result)
  }
}
