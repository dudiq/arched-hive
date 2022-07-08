import { ComponentChildren } from 'preact'
import { observer } from 'mobx-react-lite'
import { useCurrentRoute } from '@pv/interface/use-current-route'
import { Container, HeaderContainer, FooterContainer, Content } from './layout-styles'

type Props = {
  headerSlot?: ComponentChildren
  footerSlot?: ComponentChildren
  contentSlot: ComponentChildren
}

export const Layout = observer(({ contentSlot, headerSlot, footerSlot }: Props) => {
  const { currentRoute } = useCurrentRoute()
  const isHeaderVisible = currentRoute?.withHeader || currentRoute?.header
  return (
    <Container>
      {isHeaderVisible && <HeaderContainer>{headerSlot}</HeaderContainer>}
      <Content>{contentSlot}</Content>
      {currentRoute?.withNavigation && <FooterContainer>{footerSlot}</FooterContainer>}
    </Container>
  )
})
