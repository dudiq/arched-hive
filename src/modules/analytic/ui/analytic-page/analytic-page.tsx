import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from 'mobx-react-lite'
import { Swap } from '@pv/ui-kit/swap'
import { Loader } from '@pv/ui-kit/loader'
import { Container, Content } from './analytic-page-styles'
import { DateRangeSelect } from './date-range-select/date-range-select'

import './analytic-page.langs'

export const AnalyticPage = observer(() => {
  return (
    <>
      <Container>
        <DateRangeSelect />
        <Content>
          <ScrollContainer>
            <Swap is={false} isSlot={<Loader />}>
              analytic is here
            </Swap>
          </ScrollContainer>
        </Content>
      </Container>
    </>
  )
})
