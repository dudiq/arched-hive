import { AnalyticStore } from '@pv/analytic/interface/stores/analytic.store'
import { t } from '@pv/i18n'
import { ExpenseRow } from '@pv/money-spending'
import { useInject } from '@pv/service/interface/use-inject'

import { observer } from '@repo/service'
import { Separator } from '@repo/ui-kit'

export const AnalyticExpenses = observer(() => {
  const { analyticStore } = useInject({
    analyticStore: AnalyticStore,
  })

  if (!analyticStore.selectedCategoryId) return null

  return (
    <div>
      <div className="flex flex-col gap-2 mt-4">
        <Separator />
        <div className="text-xl text-center">{t('analytic.details')}</div>
      </div>

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
