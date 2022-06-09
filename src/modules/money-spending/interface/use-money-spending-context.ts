import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { MoneySpendingAction } from './actions/money-spending.action'
import { MoneySpendingStore } from './stores/money-spending.store'
import { MoneyFormStore } from './stores/money-form.store'
import { ExpensesViewStore } from './stores/expenses-view.store'

export const { useModuleContext: useMoneySpendingContext } = hookContextFactory({
  moneySpendingAction: MoneySpendingAction,
  moneySpendingStore: MoneySpendingStore,
  moneyFormStore: MoneyFormStore,
  expensesViewStore: ExpensesViewStore,
})
