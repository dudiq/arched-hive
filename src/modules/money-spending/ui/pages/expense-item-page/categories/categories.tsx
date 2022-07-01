import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { Swap } from '@pv/ui-kit/swap'
import { observer } from 'mobx-react-lite'
import { Button } from '@pv/ui-kit/button'
import { t } from '@pv/interface/services/i18n'
import { CategoryTag, Header } from './categories-styles'

export const Categories = observer(() => {
  const { moneySpendingStore, moneySpendingAction, expenseSelectionAction } =
    useMoneySpendingContext()
  const { selectedCategoryId } = moneySpendingStore
  const isCategorySelected = !!selectedCategoryId

  return (
    <>
      <Header>
        <Swap is={!isCategorySelected} isSlot={t('moneySpending.selectCategory')}>
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
