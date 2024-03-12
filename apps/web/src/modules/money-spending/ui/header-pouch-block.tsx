import { PouchBlock } from '@pv/modules/pouches'
import { observer } from '@repo/service'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'

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
