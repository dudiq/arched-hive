import { observer } from 'mobx-react-lite'
import { usePouchContext } from '@pv/modules/pouches/interface/use-pouch-context'
import { PouchItem } from '@pv/modules/pouches/ui/pouch-modal/pouch-item'
import { Button } from '@pv/ui-kit/button'
import { t } from '@pv/interface/services/i18n'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { useCallback } from 'react'

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
