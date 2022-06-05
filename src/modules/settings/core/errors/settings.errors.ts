import { createErrorClass } from '@pv/infra/create-error-class'

export namespace SettingsErrors {
  export const ImportResponse = createErrorClass('Failed import')
  export const UnexpectedErrorImport = createErrorClass('Unexpected import')

  export const DropDataResponse = createErrorClass('Failed drop data')
  export const UnexpectedErrorDropData = createErrorClass('Unexpected drop data')

  export const LoadDataResponse = createErrorClass('Failed load data')
  export const UnexpectedLoadData = createErrorClass('Unexpected load data')
}

export type SettingsErrorsInstances = InstanceType<
  typeof SettingsErrors[keyof typeof SettingsErrors]
>
