import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from 'mobx-react-lite'
import { Swap } from '@pv/ui-kit/swap'
import { Loader } from '@pv/ui-kit/loader'
import { analyticContext } from '@pv/modules/analytic/interface/analytic-context'
import { getMoney, t } from '@pv/interface/services/i18n'
import { Separator } from '@pv/ui-kit/separator'
import { useEffect } from 'react'
import { Container, Content, TotalMoneyRow } from './analytic-page-styles'
import { Header } from './header'
import { AnalyticCategory } from './analytic-category'
import { AnalyticExpenses } from './analytic-expenses'

import './analytic-page.langs'

export const AnalyticPage = observer(() => {
  const { analyticStore, analyticAction } = analyticContext()

  useEffect(() => {
    analyticAction.handleLoadReport()
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
