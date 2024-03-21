import './analytic-page.langs'

import { useEffect } from 'react'
import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'
import { Footer } from '@pv/footer/ui'
import { Header } from '@pv/header/ui'
import { getMoney, t } from '@pv/i18n'
import { Layout } from '@pv/layout/ui'

import { observer } from '@repo/service'
import { Loader, ScrollContainer, Separator, Swap } from '@repo/ui-kit'

import { HeaderPouchBlock } from '../header-pouch-block'

import { AnalyticCategory } from './analytic-category'
import { AnalyticExpenses } from './analytic-expenses'
import { AnalyticControl } from './header'

export const AnalyticPage = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()

  useEffect(() => {
    analyticAction.initialLoadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout
      headerSlot={
        <>
          <Header
            title={t('pages.analytic')}
            rightSlot={<HeaderPouchBlock />}
          />
          <Separator />
          <div className="mt-2">
            <AnalyticControl />
            <div className="flex h-12 items-center text-xl">
              {t('analytic.total')}
              <div className="ml-auto">{getMoney(analyticStore.totalCost)}</div>
            </div>
          </div>
        </>
      }
      footerSlot={<Footer />}
    >
      <ScrollContainer>
        <Swap
          is={analyticStore.isLoading}
          isSlot={
            <div className="w-full flex items-center justify-center min-h-64">
              <Loader />
            </div>
          }
        >
          <AnalyticCategory />
          <AnalyticExpenses />
        </Swap>
      </ScrollContainer>
    </Layout>
  )
})
