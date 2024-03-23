import { guid } from '@pv/app/interface/guid'

import { isErr, resultErr, resultOk } from '@repo/result'
import { AdapterService, Inject } from '@repo/service'

import { MoneySpendingErrors } from '../core/errors/money-spending.errors'

import { MoneySpendingDataProvider } from './money-spending.data-provider'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

export const MoneySpendingAdapter = AdapterService(
  class MoneySpendingAdapter {
    constructor(
      private moneySpendingDataProvider = Inject(MoneySpendingDataProvider),
    ) {}

    async getExpenses({
      pouchId,
      offset,
      limit,
    }: {
      pouchId: PouchId
      offset: number
      limit: number
    }) {
      const result = await this.moneySpendingDataProvider.getExpenses({
        offset,
        limit,
        pouchId,
      })
      if (isErr(result))
        return resultErr(
          new MoneySpendingErrors.GetExpensesResponse(result.error),
        )
      return resultOk(result.data)
    }

    async getCategories() {
      const result = await this.moneySpendingDataProvider.getCategories()
      if (isErr(result))
        return resultErr(
          new MoneySpendingErrors.GetCategoriesResponse(result.error),
        )
      return resultOk(result.data)
    }

    async removeExpense(id: string) {
      const result = await this.moneySpendingDataProvider.removeExpense(id)
      if (isErr(result))
        return resultErr(
          new MoneySpendingErrors.RemoveExpenseResponse(result.error),
        )
      return resultOk(result.data)
    }

    async updateExpense({
      id,
      time,
      desc,
      cost,
      catId,
      pouchId,
    }: {
      id: string
      time: number
      desc?: string
      cost: number
      catId: string
      pouchId: PouchId
    }) {
      const expense = {
        id,
        cost,
        desc,
        time,
        state: -1,
        pouchId,
        catId,
      }
      const result = await this.moneySpendingDataProvider.updateExpense(expense)
      if (isErr(result))
        return resultErr(
          new MoneySpendingErrors.UpdateExpenseResponse(result.error),
        )
      return resultOk(result.data)
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
      if (isErr(result))
        return resultErr(
          new MoneySpendingErrors.AddExpenseResponse(result.error),
        )
      return resultOk(result.data)
    }
  },
)
