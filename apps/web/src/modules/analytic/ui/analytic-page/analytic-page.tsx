import './analytic-page.langs'

import { useEffect } from 'react'
import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'
import { getMoney, t } from '@pv/i18n'

import { observer } from '@repo/service'
import { Loader, ScrollContainer, Separator, Swap } from '@repo/ui-kit'

import { AnalyticCategory } from './analytic-category'
import { AnalyticExpenses } from './analytic-expenses'
import { Header } from './header'

export const AnalyticPage = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()

  useEffect(() => {
    analyticAction.initialLoadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div>
        <Header />
        <Swap is={analyticStore.isLoading} isSlot={<Loader />}>
          <div>
            {t('analytic.total')}
            <div>{getMoney(analyticStore.totalCost)}</div>
          </div>
          <Separator />
          <div>
            <ScrollContainer>
              <AnalyticCategory />
              <AnalyticExpenses />
            </ScrollContainer>
          </div>
        </Swap>
      </div>
    </>
  )
})
