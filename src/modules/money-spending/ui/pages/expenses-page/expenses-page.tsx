import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from 'mobx-react-lite'
import { Swap } from '@pv/ui-kit/swap'
import { Loader } from '@pv/ui-kit/loader'
import { Link } from '@pv/ui-kit/link'
import { t } from '@pv/interface/services/i18n'
import { MoneyForm } from '@pv/modules/money-spending/ui/money-form'
import { useToggle } from '@pv/utils/use-toggle'
import { LoadMoreWrapper } from './expenses-page-styles'
import { TodayCost } from './today-cost'
import { useExpensesPage } from './use-expenses-page'
import { Controls } from './controls'
import { ExpenseList } from './expense-list'

import './expenses-page.langs'

export const ExpensesPage = observer(() => {
  const { anchorRef, moneySpendingStore, moneySpendingAction } = useExpensesPage()

  const toggleModal = useToggle()

  return (
    <>
      <ScrollContainer>
        <Swap is={moneySpendingStore.isInitialLoading} isSlot={<Loader />}>
          <TodayCost />
          <ExpenseList />
          <div ref={anchorRef} />
          <LoadMoreWrapper>
            <Link onClick={moneySpendingAction.handleLoadNextExpenses}>
              {t('expense.loadMore')}
            </Link>
          </LoadMoreWrapper>
        </Swap>
      </ScrollContainer>
      <Controls />
      <MoneyForm isVisible={toggleModal.isOpen} onClose={toggleModal.handleClose} />
    </>
  )
})
