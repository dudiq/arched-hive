import { useCallback, useEffect } from 'react'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'
import { useIntersection } from '@pv/money-spending/ui/pages/expenses-page/use-intersection'

import type { IntersectionStateType } from '@pv/money-spending/ui/pages/expenses-page/use-intersection'

export function useExpensesPage() {
  const { moneySpendingAction, moneySpendingStore } = useMoneySpendingContext()
  useEffect(() => {
    moneySpendingAction.initialLoadData()
  }, [moneySpendingAction])

  const handleChangeViewport = useCallback(
    (state: IntersectionStateType) => {
      if (state === 'hidden') return
      moneySpendingAction.handleLoadNextExpenses()
    },
    [moneySpendingAction],
  )

  const { anchorRef } = useIntersection({ onChange: handleChangeViewport })

  return {
    anchorRef,
    moneySpendingStore,
    moneySpendingAction,
  }
}
