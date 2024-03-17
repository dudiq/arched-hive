import './analytic-page.langs'

import { useEffect } from 'react'
import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'
import { Footer } from '@pv/footer/ui'
import { Header } from '@pv/header/ui'
import { getMoney, t } from '@pv/i18n'
import { Layout } from '@pv/layout/ui'

import { observer } from '@repo/service'
import { Loader, ScrollContainer, Separator, Swap } from '@repo/ui-kit'

import { AnalyticCategory } from './analytic-category'
import { AnalyticExpenses } from './analytic-expenses'
import { AnalyticHeader } from './header'

export const AnalyticPage = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()

  useEffect(() => {
    analyticAction.initialLoadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout
      headerSlot={<Header title={t('pages.analytic')} />}
      footerSlot={<Footer />}
    >
      <div>
        <AnalyticHeader />
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
    </Layout>
  )
})
