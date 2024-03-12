import { errorFactory } from '@repo/errors'

export const { CategoriesErrors } = errorFactory('CategoriesErrors', {
  AddResponse: 'Failed add category',
  GetListResponse: 'Failed get category list',
  UpdateCategoryResponse: 'Failed update category',
  RemoveCategoryResponse: 'Failed remove category',
})
