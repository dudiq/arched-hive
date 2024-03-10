import {
  CategoriesErrors
} from '@pv/modules/categories/core/categories.errors'

import {isErr, resultErr, resultOk} from '@repo/result'
import {Adapter, Inject} from '@repo/service'

import {CategoriesDataProvider} from './categories.data-provider'

import type {CategoryEntity} from '@pv/modules/categories/core/category.entity'

export class CategoriesAdapter {
  constructor(
    private categoriesDataProvider = Inject(CategoriesDataProvider),
  ) {
  }

  addCategory = Adapter(async (category: CategoryEntity) => {
    const result = await this.categoriesDataProvider.addCategory(category)
    if (isErr(result)) return resultErr(new CategoriesErrors.AddResponse(result.error))
    return resultOk(true)
  })

  getCategories = Adapter(async () => {
    const result = await this.categoriesDataProvider.getCategories()
    if (isErr(result)) return resultErr(new CategoriesErrors.GetListResponse(result.error))
    return resultOk(result.data)
  })

  updateCategoryTitle = Adapter(async (
    id: string,
    title: string,
  ) => {
    const result = await this.categoriesDataProvider.updateCategoryTitle(id, title)
    if (isErr(result)) return resultErr(new CategoriesErrors.UpdateCategoryResponse(result.error))
    return resultOk(true)
  })

  removeCategory = Adapter(async (id: string) => {
    const result = await this.categoriesDataProvider.removeCategory(id)
    if (isErr(result)) return resultErr(new CategoriesErrors.RemoveCategoryResponse(result.error))
    return resultOk(true)
  })
}
