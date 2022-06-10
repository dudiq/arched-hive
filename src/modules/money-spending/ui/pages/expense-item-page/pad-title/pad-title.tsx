import { observer } from 'mobx-react-lite'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'

export const PadTitle = observer(() => {
  const { expenseSelectionStore } = useMoneySpendingContext()

  return (
    <>
      {expenseSelectionStore.costsView}
      {expenseSelectionStore.currentCost}
    </>
  )
})
