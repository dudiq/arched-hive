import { ComponentChildren } from 'preact'
import { observer } from 'mobx-react-lite'
import { useLayout } from '@pv/modules/app/ui/layout/use-layout'
import { Container, Header, Footer, Content, ContentWrapper } from './layout-styles'

type Props = {
  headerSlot?: ComponentChildren
  footerSlot?: ComponentChildren
  contentSlot: ComponentChildren
}

export const Layout = observer(({ contentSlot, headerSlot, footerSlot }: Props) => {
  const { usedRoute } = useLayout()
  return (
    <Container>
      {usedRoute?.withHeader && <Header>{headerSlot}</Header>}
      <Content>
        <ContentWrapper>{contentSlot}</ContentWrapper>
      </Content>
      {usedRoute?.withNavigation && <Footer>{footerSlot}</Footer>}
    </Container>
  )
})
