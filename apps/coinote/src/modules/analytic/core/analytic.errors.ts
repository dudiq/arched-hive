import { errorFactory } from '@repo/errors'

export const { AnalyticErrors } = errorFactory('AnalyticErrors', {
  GetRangeReport: '',
  UnexpectedGetRangeReport: ''
})

export type AnalyticErrorsInstances = InstanceType<
  typeof AnalyticErrors[keyof typeof AnalyticErrors]
>
