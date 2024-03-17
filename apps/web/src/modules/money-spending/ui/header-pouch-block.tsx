import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'
import { PouchBlock } from '@pv/pouches'

import { observer } from '@repo/service'

export const HeaderPouchBlock = observer(() => {
  const { moneySpendingAction } = useMoneySpendingContext()

  return (
    <PouchBlock
      onSelect={() => {
        moneySpendingAction.reloadExpenses()
      }}
    />
  )
})
