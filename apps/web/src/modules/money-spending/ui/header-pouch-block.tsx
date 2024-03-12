import { PouchBlock } from '@pv/pouches'
import { observer } from '@repo/service'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

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
