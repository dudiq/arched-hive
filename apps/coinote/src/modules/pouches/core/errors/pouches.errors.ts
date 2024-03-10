import { errorFactory } from '@repo/errors'

export const { PouchesErrors } = errorFactory('PouchesErrors', {
  GetPouchesResponse: 'Failed load pouches',

  RemovePouchResponse: 'Failed to remove pouch',

  AddPouchResponse: 'Failed to add pouch',
})

