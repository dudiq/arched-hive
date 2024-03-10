import { errorFactory } from '@repo/errors'

export const { SettingsErrors } = errorFactory('SettingsErrors', {
  ImportResponse: 'Failed import',
  DropDataResponse: 'Failed drop data',
  LoadDataResponse: 'Failed load data',
})
