import { useCallback } from 'react'

import { Button, Icon } from '@repo/ui-kit'

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
    <div className="flex items-center">
      <div className="flex items-center" onClick={handleSelect}>
        <div className="my-1 mx-2 w-4">
          {!!isSelected && <Icon name="Wallet" />}
        </div>
        <div className="cursor-pointer">{pouch.name}</div>
      </div>
      {!!onRemove && (
        <div className="ml-auto">
          <Button onClick={handleRemove}>
            <div className="text-red-500">
              <Icon name="Trash" />
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
