import { t } from '@pv/i18n'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button, Swap } from '@repo/ui-kit'

export const Categories = observer(() => {
  const { moneySpendingStore, moneySpendingAction, expenseSelectionAction } =
    useMoneySpendingContext()
  const { selectedCategoryId } = moneySpendingStore
  const isCategorySelected = !!selectedCategoryId

  const isCalcVisible = moneySpendingStore.isCalculatorVisible

  return (
    <div>
      <div className="flex items-center justify-between py-3 text-xl">
        <Swap is={isCalcVisible} isSlot={t('moneySpending.typeValue')}>
          <Swap
            is={!isCategorySelected}
            isSlot={t('moneySpending.selectCategory')}
          >
            {t('moneySpending.selectSubCategory')}
          </Swap>
        </Swap>
      </div>
      <div className="flex gap-2 flex-wrap px-2">
        <Swap has={isCategorySelected}>
          <Button
            iconName="ALeft"
            iconSize="big"
            onClick={moneySpendingAction.handleDropSelectedCategory}
          >
            {moneySpendingStore.parentCategoryTitle}
          </Button>
        </Swap>
        <div className="flex gap-2 flex-wrap">
          {moneySpendingStore.visibleCategories.map((category) => {
            const isSelected = category.id === selectedCategoryId
            const isSingleCategory =
              isCategorySelected && isSelected && !category.catId
            if (isSingleCategory) return null

            return (
              <Button
                key={category.id}
                iconName={isSelected ? 'ALeft' : undefined}
                iconSize="big"
                onClick={() => {
                  expenseSelectionAction.handleSelectCategoryId(category.id)
                }}
              >
                {category.title}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
})
