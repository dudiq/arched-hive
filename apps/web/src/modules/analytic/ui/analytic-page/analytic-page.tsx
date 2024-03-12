import './analytic-page.langs'

import { useEffect } from 'react'
import { getMoney, t } from '@pv/interface/services/i18n'
import { useAnalyticContext } from '@pv/modules/analytic/interface/use-analytic-context'

import { observer } from '@repo/service'
import { Loader, ScrollContainer, Separator, Swap } from '@repo/ui-kit'

import { AnalyticCategory } from './analytic-category'
import { AnalyticExpenses } from './analytic-expenses'
import { Container, Content, TotalMoneyRow } from './analytic-page-styles'
import { Header } from './header'

export const AnalyticPage = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()

  useEffect(() => {
    analyticAction.initialLoadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container>
        <Header />
        <Swap is={analyticStore.isLoading} isSlot={<Loader />}>
          <TotalMoneyRow>
            {t('analytic.total')}
            <div>{getMoney(analyticStore.totalCost)}</div>
          </TotalMoneyRow>
          <Separator />
          <Content>
            <ScrollContainer>
              <AnalyticCategory />
              <AnalyticExpenses />
            </ScrollContainer>
          </Content>
        </Swap>
      </Container>
    </>
  )
})
