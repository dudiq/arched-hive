import { createErrorClass } from '@pv/infra/create-error-class'

export namespace MoneySpendingErrors {
  export const GetExpensesResponse = createErrorClass('Failed load expenses')
  export const UnexpectedErrorGetExpenses = createErrorClass('Unexpected load expenses')

  export const GetCategoriesResponse = createErrorClass('Failed load categories')
  export const UnexpectedErrorGetCategories = createErrorClass('Unexpected load categories')
}

export type MoneySpendingErrorsInstances = InstanceType<
  typeof MoneySpendingErrors[keyof typeof MoneySpendingErrors]
>
