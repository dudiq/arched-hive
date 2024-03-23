import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'

export const PadTitle = observer(() => {
  const { expenseSelectionStore } = useMoneySpendingContext()

  return (
    <div className="w-full text-right h-16 max-w-80 mx-auto text-xs text-gray-400 relative border-l border-r border-gray-600 px-1">
      <div>{expenseSelectionStore.costsView}</div>
      <div className="absolute right-1 text-xl text-gray-100 top-6">
        {expenseSelectionStore.currentCostView}
      </div>
      <div className="absolute right-1 bottom-0">
        = {expenseSelectionStore.totalCostView}
      </div>
    </div>
  )
})
