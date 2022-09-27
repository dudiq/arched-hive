import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { useCallback } from 'preact/compat'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'
import { ACTIONS_ENUM } from './actions.enum'

export function usePadBlock() {
  const { expenseSelectionAction } = useMoneySpendingContext()
  const handleClick = useCallback(
    (ev: any) => {
      const target = ev.target as HTMLDivElement
      const action = getAttrFromElement(target, 'data-action') as ACTIONS_ENUM
      if (!action) return
      const value = getAttrFromElement(target, 'data-value')

      switch (action) {
        case 'clear':
          expenseSelectionAction.handleClear()
          return
        case 'backspace':
          expenseSelectionAction.handleBackspaceCost()
          return
        case 'plus':
          expenseSelectionAction.handlePushCost()
          return
        case 'dot':
          expenseSelectionAction.handleSetFloat()
          return
        case 'apply':
          expenseSelectionAction.handleApply()
          return
        case 'number':
          value && expenseSelectionAction.handleAddNumber(value)
          return
      }
    },
    [expenseSelectionAction],
  )

  return {
    handleClick,
  }
}
