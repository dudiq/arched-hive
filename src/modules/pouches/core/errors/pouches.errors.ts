import { createErrorClass } from '@pv/infra/create-error-class'

export namespace PouchesErrors {
  export const GetPouchesResponse = createErrorClass('Failed load pouches')
  export const UnexpectedErrorGetPouches = createErrorClass('Unexpected load pouches')
}

export type PouchesErrorsInstances = InstanceType<typeof PouchesErrors[keyof typeof PouchesErrors]>
