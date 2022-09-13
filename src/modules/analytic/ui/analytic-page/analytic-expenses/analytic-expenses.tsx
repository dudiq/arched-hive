import { observer } from 'mobx-react-lite'
import { analyticContext } from '@pv/modules/analytic/interface/analytic-context'
import { ExpenseRow } from '@pv/modules/money-spending'
import { Container } from './analytic-expenses-styles'

export const AnalyticExpenses = observer(() => {
  const { analyticStore } = analyticContext()

  if (!analyticStore.selectedCategoryId) return null

  return (
    <Container>
      {analyticStore.expenseListView.map((expense) => {
        return <ExpenseRow key={expense.id} expenseView={expense} isSelected={false} />
      })}
    </Container>
  )
})
