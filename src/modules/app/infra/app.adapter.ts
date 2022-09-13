import { Inject, Adapter } from '@pv/di'
import { AppErrors, AppErrorsInstances } from '@pv/modules/app/core/app.errors'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { isErr, PromiseResult, resultErr, resultOk } from '@pv/modules/result'
import { AppDataProvider } from './app.data-provider'

@Adapter()
export class AppAdapter {
  constructor(
    @Inject()
    private appDataProvider: AppDataProvider,
  ) {}
  async defineCategories(categories: CategoryEntity[]): PromiseResult<null, AppErrorsInstances> {
    try {
      const result = await this.appDataProvider.defineCategories(categories)

      if (isErr(result)) return resultErr(new AppErrors.DefineCategoryResponse(result.error))

      return resultOk(null)
    } catch (e) {
      return resultErr(new AppErrors.UnexpectedErrorDefineCategory(e))
    }
  }
}
