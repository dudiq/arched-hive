import { DataProvider } from '@pv/di'
import { DatabaseDataProvider } from '@pv/infra/database.data-provider'
import { CategoryEntity } from '@pv/core/entities/category.entity'

function checkDateEnd(item: CategoryEntity) {
  return !item.dateEnd
}

@DataProvider()
export class CategoriesDataProvider extends DatabaseDataProvider {
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
