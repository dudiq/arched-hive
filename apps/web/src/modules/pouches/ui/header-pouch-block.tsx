import { MoneySpendingAction } from '@pv/money-spending/interface/actions/money-spending.action'
import { PouchBlock } from '@pv/pouches'
import { useInject } from '@pv/service/interface/use-inject'

import { observer } from '@repo/service'

export const HeaderPouchBlock = observer(() => {
  const { moneySpendingAction } = useInject({
    moneySpendingAction: MoneySpendingAction,
  })

  return (
    <PouchBlock
      onSelect={() => {
        moneySpendingAction.reloadExpenses()
      }}
    />
  )
})
