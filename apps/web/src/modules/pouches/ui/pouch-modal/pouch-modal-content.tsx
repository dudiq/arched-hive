import { useCallback } from 'react'
import { t } from '@pv/i18n'
import { useInject } from '@pv/service/interface/use-inject'

import { observer } from '@repo/service'
import { Button } from '@repo/ui-kit'

import { PouchAction } from '../../interface/actions/pouch.action'
import { PouchStore } from '../../interface/stores/pouch.store'

import { PouchItem } from './pouch-item'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

type Props = {
  onSelect: (pouchId: PouchId) => void
}

export const PouchModalContent = observer(({ onSelect }: Props) => {
  const { pouchStore, pouchAction } = useInject({
    pouchStore: PouchStore,
    pouchAction: PouchAction,
  })
  const currentId = pouchStore.currentPouchId

  const handleSelect = useCallback(
    (pouchId: PouchId) => {
      pouchAction.handleSelect(pouchId)
      onSelect(pouchId)
    },
    [onSelect, pouchAction],
  )

  return (
    <div className="flex flex-col gap-4">
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
