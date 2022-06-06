import './money-spending.langs'
import { Button } from '@pv/ui-kit/button'
import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from 'mobx-react-lite'
import { Swap } from '@pv/ui-kit/swap'
import { Loader } from '@pv/ui-kit/loader'
import { Link } from '@pv/ui-kit/link'
import { t } from '@pv/interface/services/i18n'
import { MoneyForm } from '@pv/modules/money-spending/ui/money-form'
import { ButtonWrapper, LoadMoreWrapper } from './money-spending-styles'
import { ExpenseRow } from './expense-row'
import { TodayCost } from './today-cost'
import { useMoneySpending } from './use-money-spending'

export const MoneySpending = observer(() => {
  const { anchorRef, moneySpendingStore, moneySpendingAction } = useMoneySpending()

  return (
    <>
      <ScrollContainer>
        <Swap is={moneySpendingStore.isInitialLoading} isSlot={<Loader />}>
          <TodayCost />
          {moneySpendingStore.expensesView.map((expenseView) => {
            const key = `${expenseView.id}-${expenseView.cost}-${expenseView.catParentTitle}-${expenseView.catTitle}`
            return <ExpenseRow key={key} expenseView={expenseView} />
          })}
          <div ref={anchorRef} />
          <LoadMoreWrapper>
            <Link onClick={moneySpendingAction.handleLoadNextExpenses}>
              {t('expense.loadMore')}
            </Link>
          </LoadMoreWrapper>
        </Swap>
      </ScrollContainer>
      <ButtonWrapper>
        <Button
          shape="circle"
          iconName="plus"
          iconSize="huge"
          onClick={moneySpendingStore.moneySpendingToggle.handleOpen}
        />
      </ButtonWrapper>
      <MoneyForm isVisible={moneySpendingStore.moneySpendingToggle.isOpen} />
    </>
  )
})
