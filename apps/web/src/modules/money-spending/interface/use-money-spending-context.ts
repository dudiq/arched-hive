import { useInject } from '@pv/service/interface/use-inject'

import { ExpenseSelectionAction } from './actions/expense-selection.action'
import { MoneySpendingAction } from './actions/money-spending.action'
import { ExpenseSelectionStore } from './stores/expense-selection.store'
import { ExpensesViewStore } from './stores/expenses-view.store'
import { MoneySpendingStore } from './stores/money-spending.store'

export function useMoneySpendingContext() {
  return useInject({
    moneySpendingAction: MoneySpendingAction,
    expenseSelectionAction: ExpenseSelectionAction,
    moneySpendingStore: MoneySpendingStore,
    expenseSelectionStore: ExpenseSelectionStore,
    expensesViewStore: ExpensesViewStore,
  })
}
