import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'
import { ExpenseRow } from '@pv/money-spending'

import { observer } from '@repo/service'

export const AnalyticExpenses = observer(() => {
  const { analyticStore } = useAnalyticContext()

  if (!analyticStore.selectedCategoryId) return null

  return (
    <div>
      {analyticStore.expenseListView.map((expense) => {
        return (
          <ExpenseRow
            key={expense.id}
            expenseView={expense}
            isSelected={false}
          />
        )
      })}
    </div>
  )
})
