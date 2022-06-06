import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { MoneySpendingAction } from './actions/money-spending.action'
import { MoneySpendingStore } from './stores/money-spending.store'

export const { useModuleContext: useMoneySpendingContext } = hookContextFactory({
  moneySpendingAction: MoneySpendingAction,
  moneySpendingStore: MoneySpendingStore,
})
