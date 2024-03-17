import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'

export const PadTitle = observer(() => {
  const { expenseSelectionStore } = useMoneySpendingContext()

  return (
    <div>
      <div>{expenseSelectionStore.costsView}</div>
      <div>{expenseSelectionStore.currentCostView}</div>
      <div>= {expenseSelectionStore.totalCostView}</div>
    </div>
  )
})
