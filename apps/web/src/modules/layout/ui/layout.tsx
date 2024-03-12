import { useCurrentRoute } from '@pv/dom/interface/use-current-route'

import {observer} from '@repo/service';

import { Container, Content,FooterContainer, HeaderContainer } from './layout-styles'

import type {ReactNode} from 'react';

type Props = {
  headerSlot?: ReactNode
  footerSlot?: ReactNode
  contentSlot: ReactNode
}

export const Layout = observer(({ contentSlot, headerSlot, footerSlot }: Props) => {
  // const { currentRoute } = useCurrentRoute()
  // const isHeaderVisible = currentRoute?.withHeader || currentRoute?.header
  return (
    <Container>
      {/*{!!isHeaderVisible && <HeaderContainer>{headerSlot}</HeaderContainer>}*/}
      {/*<Content>{contentSlot}</Content>*/}
      {/*{!!currentRoute?.withNavigation && <FooterContainer>{footerSlot}</FooterContainer>}*/}
    </Container>
  )
})
