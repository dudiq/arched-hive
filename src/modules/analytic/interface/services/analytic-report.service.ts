import { Inject, Service } from '@pv/di'
import { isErr } from '@pv/modules/result'
import { AnalyticStore } from '@pv/modules/analytic/interface/stores/analytic.store'
import { AnalyticAdapter } from '@pv/modules/analytic/infra/analytic.adapter'
import { PouchStore } from '@pv/modules/pouches'

@Service()
export class AnalyticReportService {
  constructor(
    @Inject()
    private analyticStore: AnalyticStore,
    @Inject()
    private analyticAdapter: AnalyticAdapter,
    @Inject()
    private pouchStore: PouchStore,
  ) {}

  async handleReport() {
    this.analyticStore.setExpenseList([])
    this.analyticStore.setCategoryList([])

    const { startDate, endDate } = this.analyticStore.range
    const currentPouchId = this.pouchStore.currentPouchId

    const result = await this.analyticAdapter.getRangeReport({
      startDate,
      endDate,
      pouchId: currentPouchId,
    })

    if (isErr(result)) {
      // TODO: add error
      return
    }
    const { expenseList, categoryList } = result.data

    this.analyticStore.setExpenseList(expenseList)
    this.analyticStore.setCategoryList(categoryList)
  }
}
