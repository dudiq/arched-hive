import { errorFactory } from '@repo/errors'

export const { AppErrors } = errorFactory('AppErrors', {
  DefineCategoryResponse: 'Failed define categories',
})
