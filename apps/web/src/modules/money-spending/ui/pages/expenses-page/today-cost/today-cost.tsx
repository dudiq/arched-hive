import { t } from '@pv/i18n'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'

import { Dot } from '../dot'

export const TodayCost = observer(() => {
  const { expensesViewStore } = useMoneySpendingContext()
  return (
    <div>
      <div>{t('expense.today')}</div>
      <div>
        <div>
          {expensesViewStore.todayCost}
          <Dot />
        </div>
      </div>
    </div>
  )
})
