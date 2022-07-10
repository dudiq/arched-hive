import { observer } from 'mobx-react-lite'
import { Separator } from '@pv/ui-kit/separator'
import { useCurrentRoute } from '@pv/interface/use-current-route'
import { Container, Title, SlotContainer } from './header-styles'

export const Header = observer(() => {
  const { currentRoute } = useCurrentRoute()
  const title = currentRoute?.header?.title() || ''
  const Component = currentRoute?.header?.component
  return (
    <>
      <Container>
        <Title>{title}</Title>
        {Component && (
          <SlotContainer>
            <Component />
          </SlotContainer>
        )}
      </Container>
      <Separator />
    </>
  )
})
