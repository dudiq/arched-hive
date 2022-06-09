import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { MoneySpendingAction } from './actions/money-spending.action'
import { MoneySpendingStore } from './stores/money-spending.store'
import { ExpenseSelectionStore } from './stores/expense-selection.store'
import { ExpensesViewStore } from './stores/expenses-view.store'
import { ExpenseSelectionAction } from './actions/expense-selection.action'

export const { useModuleContext: useMoneySpendingContext } = hookContextFactory({
  moneySpendingAction: MoneySpendingAction,
  expenseSelectionAction: ExpenseSelectionAction,
  moneySpendingStore: MoneySpendingStore,
  expenseSelectionStore: ExpenseSelectionStore,
  expensesViewStore: ExpensesViewStore,
})
