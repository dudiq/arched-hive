import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'
import { ExpenseRow } from '@pv/money-spending'

import {observer} from '@repo/service';

import { Container } from './analytic-expenses-styles'

export const AnalyticExpenses = observer(() => {
  const { analyticStore } = useAnalyticContext()

  if (!analyticStore.selectedCategoryId) return null

  return (
    <Container>
      {analyticStore.expenseListView.map((expense) => {
        return <ExpenseRow key={expense.id} expenseView={expense} isSelected={false} />
      })}
    </Container>
  )
})
