import { useCurrentRoute } from '@pv/dom/interface/use-current-route'

import { observer } from '@repo/service'
import { Separator } from '@repo/ui-kit'

import { Container, SlotContainer, Title } from './header-styles'

export const Header = observer(() => {
  const { currentRoute } = useCurrentRoute()
  // const title = currentRoute?.header?.title() || ''
  // const Component = currentRoute?.header?.component
  return (
    <>
      <Container>
        {/*<Title>{title}</Title>*/}
        {/*{!!Component && (*/}
        {/*  <SlotContainer>*/}
        {/*    <Component />*/}
        {/*  </SlotContainer>*/}
        {/*)}*/}
      </Container>
      <Separator />
    </>
  )
})
