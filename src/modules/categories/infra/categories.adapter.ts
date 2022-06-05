import { Result } from 'fnscript'
import { Inject, Adapter } from '@pv/di'
import { PromisedResult } from '@pv/di/types'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import {
  CategoriesErrors,
  CategoriesErrorsInstances,
} from '@pv/modules/categories/core/categories.errors'
import { CategoriesDataProvider } from './categories.data-provider'

@Adapter()
export class CategoriesAdapter {
  constructor(
    @Inject()
    private categoriesDataProvider: CategoriesDataProvider,
  ) {}

  async addCategory(category: CategoryEntity): PromisedResult<boolean, CategoriesErrorsInstances> {
    try {
      const { error, data } = await this.categoriesDataProvider.addCategory(category)

      if (error || !data) return Result.Err(new CategoriesErrors.AddResponse(error))

      return Result.Ok(true)
    } catch (e) {
      return Result.Err(new CategoriesErrors.UnexpectedErrorAdd(e))
    }
  }

  async getCategories(): PromisedResult<CategoryEntity[], CategoriesErrorsInstances> {
    try {
      const { error, data } = await this.categoriesDataProvider.getCategories()

      if (error || !data) return Result.Err(new CategoriesErrors.GetListResponse(error))

      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new CategoriesErrors.UnexpectedErrorGetList(e))
    }
  }

  async updateCategoryTitle(
    id: string,
    title: string,
  ): PromisedResult<boolean, CategoriesErrorsInstances> {
    try {
      const { error, data } = await this.categoriesDataProvider.updateCategoryTitle(id, title)

      if (error || !data) return Result.Err(new CategoriesErrors.UpdateCategoryResponse(error))

      return Result.Ok(true)
    } catch (e) {
      return Result.Err(new CategoriesErrors.UnexpectedErrorUpdateCategory(e))
    }
  }

  async removeCategory(id: string): PromisedResult<boolean, CategoriesErrorsInstances> {
    try {
      const { error, data } = await this.categoriesDataProvider.removeCategory(id)

      if (error || !data) return Result.Err(new CategoriesErrors.RemoveCategoryResponse(error))

      return Result.Ok(true)
    } catch (e) {
      return Result.Err(new CategoriesErrors.UnexpectedErrorRemoveCategory(e))
    }
  }
}
