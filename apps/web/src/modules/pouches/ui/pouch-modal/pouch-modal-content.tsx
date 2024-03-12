import { useCallback } from 'react'
import { t } from '@pv/i18n'
import { usePouchContext } from '@pv/pouches/interface/use-pouch-context'
import { PouchItem } from '@pv/pouches/ui/pouch-modal/pouch-item'

import { observer } from '@repo/service'
import { Button } from '@repo/ui-kit'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

type Props = {
  onSelect: (pouchId: PouchId) => void
}

export const PouchModalContent = observer(({ onSelect }: Props) => {
  const { pouchStore, pouchAction } = usePouchContext()
  const currentId = pouchStore.currentPouchId

  const handleSelect = useCallback(
    (pouchId: PouchId) => {
      pouchAction.handleSelect(pouchId)
      onSelect(pouchId)
    },
    [onSelect, pouchAction],
  )

  return (
    <div>
      <PouchItem
        isSelected={currentId === null}
        pouch={{ name: t('export.pouchMain'), id: null }}
        onSelect={handleSelect}
      />

      {pouchStore.pouches.map((pouch) => {
        return (
          <PouchItem
            isSelected={currentId === pouch.id}
            key={`${pouch.id}-${pouch.name}`}
            pouch={pouch}
            onRemove={pouchAction.handleRemove}
            onSelect={handleSelect}
          />
        )
      })}
      <Button onClick={pouchAction.handleAdd}>{t('pouchBlock.add')}</Button>
    </div>
  )
})
