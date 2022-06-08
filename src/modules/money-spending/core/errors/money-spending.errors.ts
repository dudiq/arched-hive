import { createErrorClass } from '@pv/infra/create-error-class'

export namespace MoneySpendingErrors {
  export const GetExpensesResponse = createErrorClass('Failed load expenses')
  export const UnexpectedErrorGetExpenses = createErrorClass('Unexpected load expenses')

  export const GetCategoriesResponse = createErrorClass('Failed load categories')
  export const UnexpectedErrorGetCategories = createErrorClass('Unexpected load categories')

  export const RemoveExpenseResponse = createErrorClass('Failed remove expense')
  export const UnexpectedErrorRemoveExpense = createErrorClass('Unexpected remove expense')
}

export type MoneySpendingErrorsInstances = InstanceType<
  typeof MoneySpendingErrors[keyof typeof MoneySpendingErrors]
>
