import { createErrorClass } from '@pv/infra/create-error-class'

export namespace AppErrors {
  export const DefineCategoryResponse = createErrorClass('Failed define categories')
  export const UnexpectedErrorDefineCategory = createErrorClass('Unexpected add category')
}

export type AppErrorsInstances = InstanceType<typeof AppErrors[keyof typeof AppErrors]>
