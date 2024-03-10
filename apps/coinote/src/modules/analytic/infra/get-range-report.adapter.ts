import {isErr, resultErr, resultOk} from '@repo/result'
import {Adapter, Inject} from '@repo/service'

import {AnalyticErrors} from '../core/analytic.errors'

import {AnalyticDataProvider} from './analytic.data-provider'

import type {PouchId} from '@pv/modules/pouches/core/pouch.entity';

export const getRangeReportAdapter = Adapter(async ({
                                                      startDate,
                                                      endDate,
                                                      pouchId,
                                                    }: {
  startDate: number
  endDate: number
  pouchId: PouchId
}) => {
  const result = await Inject(AnalyticDataProvider).getRangeReport({startDate, endDate, pouchId})

  if (isErr(result)) return resultErr(new AnalyticErrors.GetRangeReport(result.error))

  return resultOk(result.data)
})
