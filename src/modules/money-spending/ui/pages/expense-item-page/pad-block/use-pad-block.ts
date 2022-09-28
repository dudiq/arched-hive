import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { useCallback } from 'preact/compat'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'
import { ACTIONS_ENUM } from './actions.enum'

export function usePadBlock() {
  const { expenseSelectionAction, expenseSelectionStore } = useMoneySpendingContext()
  const handleClick = useCallback(
    (ev: any) => {
      const target = ev.target as HTMLDivElement
      const action = getAttrFromElement(target, 'data-action') as ACTIONS_ENUM
      if (!action) return
      const value = getAttrFromElement(target, 'data-value')

      switch (action) {
        case 'CLEAR':
          expenseSelectionAction.handleClear()
          return
        case 'BACKSPACE':
          expenseSelectionAction.handleBackspaceCost()
          return
        case 'PLUS':
          expenseSelectionAction.handlePushCost()
          return
        case 'DOT':
          expenseSelectionAction.handleSetFloat()
          return
        case 'UPDATE':
          expenseSelectionAction.handleUpdate()
          return
        case 'APPLY':
          expenseSelectionAction.handleApply()
          return
        case 'NUMBER':
          value && expenseSelectionAction.handleAddNumber(value)
          return
      }
    },
    [expenseSelectionAction],
  )

  return {
    handleClick,
    isEditing: expenseSelectionStore.isEditing,
  }
}
