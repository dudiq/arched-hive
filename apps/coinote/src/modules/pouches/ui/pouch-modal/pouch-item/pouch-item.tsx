import { PouchEntity, PouchId } from '@pv/modules/pouches/core/pouch.entity'
import { Icon } from '@pv/ui-kit/icon'
import { useCallback } from 'preact/compat'
import { Button } from '@pv/ui-kit/button'
import { ActionWrapper, Container, IconWrapper, Row, TitleWrapper } from './pouch-item-styles'

type Props = {
  isSelected: boolean
  pouch: PouchEntity
  onRemove?: (id: PouchId) => void
  onSelect: (id: PouchId) => void
}

export function PouchItem({ pouch, onRemove, isSelected, onSelect }: Props) {
  const handleRemove = useCallback(() => {
    onRemove && onRemove(pouch.id)
  }, [onRemove, pouch])

  const handleSelect = useCallback(() => {
    onSelect(pouch.id)
  }, [onSelect, pouch.id])

  return (
    <Container>
      <Row onClick={handleSelect}>
        <IconWrapper>{isSelected && <Icon iconName="wallet" />}</IconWrapper>
        <TitleWrapper>{pouch.name}</TitleWrapper>
      </Row>
      {onRemove && (
        <ActionWrapper>
          <Button variant="flat" onClick={handleRemove}>
            <Icon iconName="cross" />
          </Button>
        </ActionWrapper>
      )}
    </Container>
  )
}
