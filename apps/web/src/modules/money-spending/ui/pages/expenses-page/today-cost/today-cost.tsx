import { t } from '@pv/i18n'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'

import { Dot } from '../dot'

export const TodayCost = observer(() => {
  const { expensesViewStore } = useMoneySpendingContext()
  return (
    <div className="flex items-center justify-center w-full h-10 border-b dark:border-gray-800 border-gray-200">
      <div className="flex w-full items-center justify-center text-gray-500">
        {t('expense.today')}
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="flex items-center gap-2">
          {expensesViewStore.todayCost}
          <Dot />
        </div>
      </div>
    </div>
  )
})
