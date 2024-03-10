import { AppErrors } from '@pv/modules/app/core/app.errors'

import { isErr, resultErr, resultOk } from '@repo/result'
import { Adapter,Inject } from '@repo/service'

import { AppDataProvider } from './app.data-provider'

import type { CategoryEntity } from '@pv/modules/categories/core/category.entity'

export const defineCategoriesAdapter = Adapter(async (categories: CategoryEntity[]) => {
  const result = await Inject(AppDataProvider).defineCategories(categories)

  if (isErr(result)) return resultErr(new AppErrors.DefineCategoryResponse())

  return resultOk(null)
})
