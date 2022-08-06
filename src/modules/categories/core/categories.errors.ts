import { errorFactory } from '@pv/modules/errors'

export const { CategoriesErrors } = errorFactory('CategoriesErrors', {
  AddResponse: 'Failed add category',
  UnexpectedErrorAdd: 'Unexpected add category',

  GetListResponse: 'Failed get category list',
  UnexpectedErrorGetList: 'Unexpected get category list',

  UpdateCategoryResponse: 'Failed update category',
  UnexpectedErrorUpdateCategory: 'Unexpected update category',

  RemoveCategoryResponse: 'Failed remove category',
  UnexpectedErrorRemoveCategory: 'Unexpected remove category',
})

export type CategoriesErrorsInstances = InstanceType<
  typeof CategoriesErrors[keyof typeof CategoriesErrors]
>
