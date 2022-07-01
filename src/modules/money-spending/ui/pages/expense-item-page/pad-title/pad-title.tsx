import { observer } from 'mobx-react-lite'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { Container, CostView, CurrentCost, TotalCost } from './pad-title-styles'

export const PadTitle = observer(() => {
  const { expenseSelectionStore } = useMoneySpendingContext()

  return (
    <Container>
      <CostView>{expenseSelectionStore.costsView}</CostView>
      <CurrentCost>{expenseSelectionStore.currentCostView}</CurrentCost>
      <TotalCost>= {expenseSelectionStore.totalCostView}</TotalCost>
    </Container>
  )
})
