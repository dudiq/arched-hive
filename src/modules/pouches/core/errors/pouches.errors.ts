import { errorFactory } from '@pv/modules/errors'

export const { PouchesErrors } = errorFactory('PouchesErrors', {
  GetPouchesResponse: 'Failed load pouches',
  UnexpectedErrorGetPouches: 'Unexpected load pouches',

  RemovePouchResponse: 'Failed to remove pouch',
  UnexpectedErrorRemovePouch: 'Unexpected remove pouch',

  AddPouchResponse: 'Failed to add pouch',
  UnexpectedErrorAddPouch: 'Unexpected add pouch',
})

export type PouchesErrorsInstances = InstanceType<typeof PouchesErrors[keyof typeof PouchesErrors]>
