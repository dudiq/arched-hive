import { ComponentChildren } from 'preact'
import { Container, Header, Footer, Content } from './layout-styles'

type Props = {
  headerSlot?: ComponentChildren
  footerSlot?: ComponentChildren
  contentSlot: ComponentChildren
}

export function Layout({ contentSlot, headerSlot, footerSlot }: Props) {
  return (
    <Container>
      <Header>{headerSlot}</Header>
      <Content>{contentSlot}</Content>
      <Footer>{footerSlot}</Footer>
    </Container>
  )
}
