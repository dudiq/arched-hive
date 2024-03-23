import { CategoriesErrors } from '@pv/categories/core/categories.errors'

import { isErr, resultErr, resultOk } from '@repo/result'
import { AdapterService, Inject } from '@repo/service'

import { CategoriesDataProvider } from './categories.data-provider'

import type { CategoryEntity } from '@pv/categories/core/category.entity'

export const CategoriesAdapter = AdapterService(
  class CategoriesAdapter {
    constructor(
      private categoriesDataProvider = Inject(CategoriesDataProvider),
    ) {}

    async addCategory(category: CategoryEntity) {
      const result = await this.categoriesDataProvider.addCategory(category)
      if (isErr(result))
        return resultErr(new CategoriesErrors.AddResponse(result.error))
      return resultOk(true)
    }

    async getCategories() {
      const result = await this.categoriesDataProvider.getCategories()
      if (isErr(result))
        return resultErr(new CategoriesErrors.GetListResponse(result.error))
      return resultOk(result.data)
    }

    async updateCategoryTitle(id: string, title: string) {
      const result = await this.categoriesDataProvider.updateCategoryTitle(
        id,
        title,
      )
      if (isErr(result))
        return resultErr(
          new CategoriesErrors.UpdateCategoryResponse(result.error),
        )
      return resultOk(true)
    }

    async removeCategory(id: string) {
      const result = await this.categoriesDataProvider.removeCategory(id)
      if (isErr(result))
        return resultErr(
          new CategoriesErrors.RemoveCategoryResponse(result.error),
        )
      return resultOk(true)
    }
  },
)
