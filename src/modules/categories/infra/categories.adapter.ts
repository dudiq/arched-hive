import { Inject, Adapter } from '@pv/di'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import {
  CategoriesErrors,
  CategoriesErrorsInstances,
} from '@pv/modules/categories/core/categories.errors'
import { isErr, PromiseResult, resultErr, resultOk } from '@pv/modules/result'
import { CategoriesDataProvider } from './categories.data-provider'

@Adapter()
export class CategoriesAdapter {
  constructor(
    @Inject()
    private categoriesDataProvider: CategoriesDataProvider,
  ) {}

  async addCategory(category: CategoryEntity): PromiseResult<boolean, CategoriesErrorsInstances> {
    try {
      const result = await this.categoriesDataProvider.addCategory(category)

      if (isErr(result)) return resultErr(new CategoriesErrors.AddResponse(result.error))

      return resultOk(true)
    } catch (e) {
      return resultErr(new CategoriesErrors.UnexpectedErrorAdd(e))
    }
  }

  async getCategories(): PromiseResult<CategoryEntity[], CategoriesErrorsInstances> {
    try {
      const result = await this.categoriesDataProvider.getCategories()

      if (isErr(result)) return resultErr(new CategoriesErrors.GetListResponse(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new CategoriesErrors.UnexpectedErrorGetList(e))
    }
  }

  async updateCategoryTitle(
    id: string,
    title: string,
  ): PromiseResult<boolean, CategoriesErrorsInstances> {
    try {
      const result = await this.categoriesDataProvider.updateCategoryTitle(id, title)

      if (isErr(result)) return resultErr(new CategoriesErrors.UpdateCategoryResponse(result.error))

      return resultOk(true)
    } catch (e) {
      return resultErr(new CategoriesErrors.UnexpectedErrorUpdateCategory(e))
    }
  }

  async removeCategory(id: string): PromiseResult<boolean, CategoriesErrorsInstances> {
    try {
      const result = await this.categoriesDataProvider.removeCategory(id)

      if (isErr(result)) return resultErr(new CategoriesErrors.RemoveCategoryResponse(result.error))

      return resultOk(true)
    } catch (e) {
      return resultErr(new CategoriesErrors.UnexpectedErrorRemoveCategory(e))
    }
  }
}
