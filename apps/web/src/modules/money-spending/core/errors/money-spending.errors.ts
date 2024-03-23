import { errorFactory } from '@repo/errors'

export const { MoneySpendingErrors } = errorFactory('MoneySpendingErrors', {
  GetExpensesResponse: 'Failed load expenses',
  GetCategoriesResponse: 'Failed load categories',
  RemoveExpenseResponse: 'Failed remove expense',
  AddExpenseResponse: 'Failed add expense',
  UpdateExpenseResponse: 'Failed update expense',
})
