import { PouchEntity, PouchId } from '@pv/core/entities/pouch.entity'
import { Icon } from '@pv/ui-kit/icon'
import { useCallback } from 'preact/compat'
import { Button } from '@pv/ui-kit/button'
import { ActionWrapper, Container, IconWrapper, TitleWrapper } from './pouch-item-styles'

type Props = {
  pouch: PouchEntity
  onRemove: (id: PouchId) => void
}

export function PouchItem({ pouch, onRemove }: Props) {
  const handleRemove = useCallback(() => {
    onRemove(pouch.id)
  }, [onRemove, pouch])
  return (
    <Container>
      <IconWrapper>
        <Icon iconName="wallet" />
      </IconWrapper>
      <TitleWrapper>{pouch.name}</TitleWrapper>
      <ActionWrapper>
        <Button variant="flat" onClick={handleRemove}>
          <Icon iconName="cross" />
        </Button>
      </ActionWrapper>
    </Container>
  )
}
