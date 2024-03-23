import {getRangeReportAdapter} from '@pv/analytic/infra/get-range-report.adapter';
import { PouchStore } from '@pv/pouches'

import { Inject, Service } from '@repo/service'

import { AnalyticStore } from '../stores/analytic.store'

@Service()
export class AnalyticReportService {
  constructor(
    private readonly analyticStore = Inject(AnalyticStore),
    private readonly pouchStore = Inject(PouchStore),
  ) {}

  async handleReport() {
    const { startDate, endDate } = this.analyticStore.range
    const currentPouchId = this.pouchStore.currentPouchId

    const result = await getRangeReportAdapter({
      startDate,
      endDate,
      pouchId: currentPouchId,
    })

    this.analyticStore.lists.setResult(result)
  }
}
