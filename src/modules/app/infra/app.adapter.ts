import { Result } from 'fnscript'
import { Inject, Adapter } from '@pv/di'
import { PromisedResult } from '@pv/di/types'
import { AppErrors, AppErrorsInstances } from '@pv/modules/app/core/app.errors'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { AppDataProvider } from './app.data-provider'

@Adapter()
export class AppAdapter {
  constructor(
    @Inject()
    private appDataProvider: AppDataProvider,
  ) {}
  async defineCategories(categories: CategoryEntity[]): PromisedResult<null, AppErrorsInstances> {
    try {
      const { error } = await this.appDataProvider.defineCategories(categories)

      if (error) return Result.Err(new AppErrors.DefineCategoryResponse(error))

      return Result.Ok(null)
    } catch (e) {
      return Result.Err(new AppErrors.UnexpectedErrorDefineCategory(e))
    }
  }
}
