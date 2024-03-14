import { useCallback } from 'react'

import { Button, Icon } from '@repo/ui-kit'

import {
  ActionWrapper,
  Container,
  IconWrapper,
  Row,
  TitleWrapper,
} from './pouch-item-styles'

import type { PouchEntity, PouchId } from '@pv/pouches/core/pouch.entity'

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
        <IconWrapper>{!!isSelected && <Icon name="Wallet" />}</IconWrapper>
        <TitleWrapper>{pouch.name}</TitleWrapper>
      </Row>
      {!!onRemove && (
        <ActionWrapper>
          <Button variant="flat" onClick={handleRemove}>
            <Icon name="Cross" />
          </Button>
        </ActionWrapper>
      )}
    </Container>
  )
}
