import './expenses-page.langs'

import { Footer } from '@pv/footer/ui'
import { Header } from '@pv/header/ui'
import { t } from '@pv/i18n'
import { Layout } from '@pv/layout/ui'

import { observer } from '@repo/service'
import { Link, Loader, ScrollContainer, Swap } from '@repo/ui-kit'

import { Controls } from './controls'
import { ExpenseList } from './expense-list'
import { TodayCost } from './today-cost'
import { useExpensesPage } from './use-expenses-page'

export const ExpensesPage = observer(() => {
  const { anchorRef, moneySpendingStore, moneySpendingAction } =
    useExpensesPage()

  return (
    <Layout
      headerSlot={<Header title={t('pages.expense')} />}
      footerSlot={<Footer />}
    >
      <ScrollContainer>
        <Swap is={moneySpendingStore.isInitialLoading} isSlot={<Loader />}>
          <TodayCost />
          <ExpenseList />
          <div ref={anchorRef} />
          {!!moneySpendingStore.isShowMoreVisible && (
            <div>
              <Link onClick={moneySpendingAction.handleLoadNextExpenses}>
                {t('expense.loadMore')}
              </Link>
            </div>
          )}
        </Swap>
      </ScrollContainer>
      <Controls />
    </Layout>
  )
})
