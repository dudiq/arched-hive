import { errorFactory } from '@pv/modules/errors'

export const { MoneySpendingErrors } = errorFactory('MoneySpendingErrors', {
  GetExpensesResponse: 'Failed load expenses',
  UnexpectedErrorGetExpenses: 'Unexpected load expenses',

  GetCategoriesResponse: 'Failed load categories',
  UnexpectedErrorGetCategories: 'Unexpected load categories',

  RemoveExpenseResponse: 'Failed remove expense',
  UnexpectedErrorRemoveExpense: 'Unexpected remove expense',

  AddExpenseResponse: 'Failed add expense',
  UnexpectedErrorAddExpense: 'Unexpected add expense',
})

export type MoneySpendingErrorsInstances = InstanceType<
  typeof MoneySpendingErrors[keyof typeof MoneySpendingErrors]
>
