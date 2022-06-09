import { observer } from 'mobx-react-lite'
import { Input } from '@pv/ui-kit/input'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'

export const Desc = observer(() => {
  const { expenseSelectionAction, expenseSelectionStore } = useMoneySpendingContext()

  return (
    <Input
      value={expenseSelectionStore.currentDesc}
      onChange={expenseSelectionAction.handleChangeDesc}
    />
  )
})
