import { Result } from 'fnscript'
import { Inject, Adapter } from '@pv/di'
import { PromisedResult } from '@pv/di/types'
import {
  MoneySpendingErrors,
  MoneySpendingErrorsInstances,
} from '@pv/modules/money-spending/core/errors/money-spending.errors'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { PouchId } from '@pv/core/entities/pouch.entity'
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
  }): PromisedResult<ExpenseEntity[], MoneySpendingErrorsInstances> {
    try {
      const { error, data } = await this.moneySpendingDataProvider.getExpenses({
        offset,
        limit,
        pouchId,
      })

      if (error) return Result.Err(new MoneySpendingErrors.GetExpensesResponse(error))

      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new MoneySpendingErrors.UnexpectedErrorGetExpenses(e))
    }
  }

  async getCategories(): PromisedResult<CategoryEntity[], MoneySpendingErrorsInstances> {
    try {
      const { error, data } = await this.moneySpendingDataProvider.getCategories()

      if (error) return Result.Err(new MoneySpendingErrors.GetCategoriesResponse(error))

      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new MoneySpendingErrors.UnexpectedErrorGetCategories(e))
    }
  }

  async removeExpense(id: string) {
    try {
      const { error, data } = await this.moneySpendingDataProvider.removeExpense(id)

      if (error) return Result.Err(new MoneySpendingErrors.RemoveExpenseResponse(error))

      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new MoneySpendingErrors.UnexpectedErrorRemoveExpense(e))
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
      const { error, data } = await this.moneySpendingDataProvider.addExpense({
        desc,
        cost,
        catId,
        pouchId,
      })

      if (error) return Result.Err(new MoneySpendingErrors.AddExpenseResponse(error))

      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new MoneySpendingErrors.UnexpectedErrorAddExpense(e))
    }
  }
}
