import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { useCallback, useEffect } from 'preact/compat'
import { IntersectionStateType, useIntersection } from '@pv/ui/use-intersection'

export function useMoneySpending() {
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
