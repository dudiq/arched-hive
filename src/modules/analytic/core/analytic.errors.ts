import { errorFactory } from '@pv/modules/errors'

export const { AnalyticErrors } = errorFactory('AnalyticErrors', {
  GetRangeReport: 'Failed get range report',
  UnexpectedGetRangeReport: 'Unexpected get range report',
})

export type AnalyticErrorsInstances = InstanceType<
  typeof AnalyticErrors[keyof typeof AnalyticErrors]
>
