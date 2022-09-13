import { errorFactory } from '@pv/modules/errors'

export const { AppErrors } = errorFactory('AppErrors', {
  DefineCategoryResponse: 'Failed define categories',
  UnexpectedErrorDefineCategory: 'Unexpected add category',
})

export type AppErrorsInstances = InstanceType<typeof AppErrors[keyof typeof AppErrors]>
