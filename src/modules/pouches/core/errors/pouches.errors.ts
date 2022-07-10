import { createErrorClass } from '@pv/infra/create-error-class'

export namespace PouchesErrors {
  export const GetPouchesResponse = createErrorClass('Failed load pouches')
  export const UnexpectedErrorGetPouches = createErrorClass('Unexpected load pouches')

  export const RemovePouchResponse = createErrorClass('Failed to remove pouch')
  export const UnexpectedErrorRemovePouch = createErrorClass('Unexpected remove pouch')

  export const AddPouchResponse = createErrorClass('Failed to add pouch')
  export const UnexpectedErrorAddPouch = createErrorClass('Unexpected add pouch')
}

export type PouchesErrorsInstances = InstanceType<typeof PouchesErrors[keyof typeof PouchesErrors]>
