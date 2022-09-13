import { Inject, Adapter } from '@pv/di'
import {
  MoneySpendingErrors,
  MoneySpendingErrorsInstances,
} from '@pv/modules/money-spending/core/errors/money-spending.errors'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { guid } from '@pv/utils/guid'
import { isErr, PromiseResult, resultErr, resultOk } from '@pv/modules/result'
import { MoneySpendingDataProvider } from './money-spending.data-provider'

@Adapter()
export class MoneySpendingAdapter {
  constructor(
    @Inject()
    private moneySpendingDataProvider: MoneySpendingDataProvider,
  ) {}

  async getExpenses({
    pouchId,
    offset,
    limit,
  }: {
    pouchId: PouchId
    offset: number
    limit: number
  }): PromiseResult<ExpenseEntity[], MoneySpendingErrorsInstances> {
    try {
      const result = await this.moneySpendingDataProvider.getExpenses({
        offset,
        limit,
        pouchId,
      })

      if (isErr(result)) return resultErr(new MoneySpendingErrors.GetExpensesResponse(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new MoneySpendingErrors.UnexpectedErrorGetExpenses(e))
    }
  }

  async getCategories(): PromiseResult<CategoryEntity[], MoneySpendingErrorsInstances> {
    try {
      const result = await this.moneySpendingDataProvider.getCategories()

      if (isErr(result))
        return resultErr(new MoneySpendingErrors.GetCategoriesResponse(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new MoneySpendingErrors.UnexpectedErrorGetCategories(e))
    }
  }

  async removeExpense(id: string) {
    try {
      const result = await this.moneySpendingDataProvider.removeExpense(id)

      if (isErr(result))
        return resultErr(new MoneySpendingErrors.RemoveExpenseResponse(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new MoneySpendingErrors.UnexpectedErrorRemoveExpense(e))
    }
  }

  async addExpense({
    desc,
    cost,
    catId,
    pouchId,
  }: {
    desc?: string
    cost: number
    catId: string
    pouchId: PouchId
  }) {
    try {
      const expense = {
        id: guid(),
        cost,
        desc,
        time: new Date().getTime(),
        state: -1,
        pouchId,
        catId,
      }
      const result = await this.moneySpendingDataProvider.addExpense(expense)

      if (isErr(result)) return resultErr(new MoneySpendingErrors.AddExpenseResponse(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new MoneySpendingErrors.UnexpectedErrorAddExpense(e))
    }
  }
}
