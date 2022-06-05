import { createErrorClass } from '@pv/infra/create-error-class'

export namespace CategoriesErrors {
  export const AddResponse = createErrorClass('Failed add category')
  export const UnexpectedErrorAdd = createErrorClass('Unexpected add category')

  export const GetListResponse = createErrorClass('Failed get category list')
  export const UnexpectedErrorGetList = createErrorClass('Unexpected get category list')

  export const UpdateCategoryResponse = createErrorClass('Failed update category')
  export const UnexpectedErrorUpdateCategory = createErrorClass('Unexpected update category')

  export const RemoveCategoryResponse = createErrorClass('Failed remove category')
  export const UnexpectedErrorRemoveCategory = createErrorClass('Unexpected remove category')
}

export type CategoriesErrorsInstances = InstanceType<
  typeof CategoriesErrors[keyof typeof CategoriesErrors]
>
