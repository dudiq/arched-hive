import { observer } from 'mobx-react-lite'
import { Input } from '@pv/ui-kit/input'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { Container } from './desc-styles'

export const Desc = observer(() => {
  const { expenseSelectionAction, expenseSelectionStore } = useMoneySpendingContext()

  return (
    <Container>
      <Input
        value={expenseSelectionStore.currentDesc}
        onChange={expenseSelectionAction.handleChangeDesc}
      />
    </Container>
  )
})
