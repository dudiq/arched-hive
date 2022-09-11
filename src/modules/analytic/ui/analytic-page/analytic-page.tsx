import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from 'mobx-react-lite'
import { Swap } from '@pv/ui-kit/swap'
import { Loader } from '@pv/ui-kit/loader'
import { analyticContext } from '@pv/modules/analytic/interface/analytic-context'
import { Container, Content } from './analytic-page-styles'
import { Header } from './header'

import './analytic-page.langs'

export const AnalyticPage = observer(() => {
  const { analyticStore } = analyticContext()
  return (
    <>
      <Container>
        <Header />
        <Content>
          <ScrollContainer>
            <Swap is={analyticStore.isLoading} isSlot={<Loader />}>
              analytic is here
            </Swap>
          </ScrollContainer>
        </Content>
      </Container>
    </>
  )
})
