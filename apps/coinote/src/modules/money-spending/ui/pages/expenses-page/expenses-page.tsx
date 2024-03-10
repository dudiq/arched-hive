import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from '@repo/service'
import { Swap } from '@pv/ui-kit/swap'
import { Loader } from '@pv/ui-kit/loader'
import { Link } from '@pv/ui-kit/link'
import { t } from '@pv/interface/services/i18n'
import { LoadMoreWrapper } from './expenses-page-styles'
import { TodayCost } from './today-cost'
import { useExpensesPage } from './use-expenses-page'
import { Controls } from './controls'
import { ExpenseList } from './expense-list'

import './expenses-page.langs'

export const ExpensesPage = observer(() => {
  const { anchorRef, moneySpendingStore, moneySpendingAction } = useExpensesPage()

  return (
    <>
      <ScrollContainer>
        <Swap is={moneySpendingStore.isInitialLoading} isSlot={<Loader />}>
          <TodayCost />
          <ExpenseList />
          <div ref={anchorRef} />
          {moneySpendingStore.isShowMoreVisible && (
            <LoadMoreWrapper>
              <Link onClick={moneySpendingAction.handleLoadNextExpenses}>
                {t('expense.loadMore')}
              </Link>
            </LoadMoreWrapper>
          )}
        </Swap>
      </ScrollContainer>
      <Controls />
    </>
  )
})
