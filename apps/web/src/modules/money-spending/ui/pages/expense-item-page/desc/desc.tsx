import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Input } from '@repo/ui-kit'

export const Desc = observer(() => {
  const { expenseSelectionAction, expenseSelectionStore } =
    useMoneySpendingContext()

  return (
    <div className="flex items-center">
      <Input
        value={expenseSelectionStore.currentDesc}
        onChange={expenseSelectionAction.handleChangeDesc}
      />
    </div>
  )
})
