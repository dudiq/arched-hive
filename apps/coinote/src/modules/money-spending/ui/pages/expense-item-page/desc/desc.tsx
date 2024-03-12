import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Input } from '@repo/ui-kit'

import { Container } from './desc-styles'

export const Desc = observer(() => {
  const { expenseSelectionAction, expenseSelectionStore } =
    useMoneySpendingContext()

  return (
    <Container>
      <Input
        value={expenseSelectionStore.currentDesc}
        onChange={expenseSelectionAction.handleChangeDesc}
      />
    </Container>
  )
})
