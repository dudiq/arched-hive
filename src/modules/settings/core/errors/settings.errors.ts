import { errorFactory } from '@pv/modules/errors'

export const { SettingsErrors } = errorFactory('SettingsErrors', {
  ImportResponse: 'Failed import',
  UnexpectedErrorImport: 'Unexpected import',

  DropDataResponse: 'Failed drop data',
  UnexpectedErrorDropData: 'Unexpected drop data',

  LoadDataResponse: 'Failed load data',
  UnexpectedLoadData: 'Unexpected load data',
})

export type SettingsErrorsInstances = InstanceType<
  typeof SettingsErrors[keyof typeof SettingsErrors]
>
