import { t } from '@pv/i18n'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button, Swap } from '@repo/ui-kit'

import { CategoryTag, Header } from './categories-styles'

export const Categories = observer(() => {
  const { moneySpendingStore, moneySpendingAction, expenseSelectionAction } =
    useMoneySpendingContext()
  const { selectedCategoryId } = moneySpendingStore
  const isCategorySelected = !!selectedCategoryId

  return (
    <>
      <Header>
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
      </Header>
      {moneySpendingStore.visibleCategories.map((category) => {
        const isSelected = category.id === selectedCategoryId
        return (
          <CategoryTag
            key={category.id}
            onClick={() => {
              expenseSelectionAction.handleSelectCategoryId(category.id)
            }}
            isSelected={isSelected}
          >
            {category.title}
          </CategoryTag>
        )
      })}
    </>
  )
})
