import { t } from '@pv/i18n'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button, Swap } from '@repo/ui-kit'

export const Categories = observer(() => {
  const { moneySpendingStore, moneySpendingAction, expenseSelectionAction } =
    useMoneySpendingContext()
  const { selectedCategoryId } = moneySpendingStore
  const isCategorySelected = !!selectedCategoryId

  return (
    <>
      <div>
        <Swap
          is={!isCategorySelected}
          isSlot={t('moneySpending.selectCategory')}
        >
          <Button
            iconName="cross"
            iconSize="big"
            variant="flat"
            onClick={moneySpendingAction.handleDropSelectedCategory}
          >
            {moneySpendingStore.parentCategoryTitle}
          </Button>
        </Swap>
      </div>
      {moneySpendingStore.visibleCategories.map((category) => {
        const isSelected = category.id === selectedCategoryId
        return (
          <div
            key={category.id}
            onClick={() => {
              expenseSelectionAction.handleSelectCategoryId(category.id)
            }}
            // isSelected={isSelected}
          >
            {category.title}
          </div>
        )
      })}
    </>
  )
})
