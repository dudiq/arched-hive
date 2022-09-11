import { Inject, Adapter } from '@pv/di'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { isErr, PromiseResult, resultErr, resultOk } from '@pv/modules/result'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { AnalyticErrors, AnalyticErrorsInstances } from '@pv/modules/analytic/core/analytic.errors'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { AnalyticDataProvider } from './analytic.data-provider'

type RangeReportResult = PromiseResult<
  { categoryList: CategoryEntity[]; expenseList: ExpenseEntity[] },
  AnalyticErrorsInstances
>

@Adapter()
export class AnalyticAdapter {
  constructor(
    @Inject()
    private analyticDataProvider: AnalyticDataProvider,
  ) {}

  async getRangeReport({
    startDate,
    endDate,
    pouchId,
  }: {
    startDate: number
    endDate: number
    pouchId: PouchId
  }): RangeReportResult {
    try {
      const result = await this.analyticDataProvider.getRangeReport({ startDate, endDate, pouchId })

      if (isErr(result)) return resultErr(new AnalyticErrors.GetRangeReport(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new AnalyticErrors.UnexpectedGetRangeReport(e))
    }
  }
}
