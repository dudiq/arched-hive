import { PouchBlock } from '@pv/modules/pouches'
import { observer } from 'mobx-react-lite'
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
