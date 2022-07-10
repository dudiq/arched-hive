import { observer } from 'mobx-react-lite'
import { usePouchContext } from '@pv/modules/pouches/interface/use-pouch-context'
import { PouchItem } from '@pv/modules/pouches/ui/pouch-modal/pouch-item'
import { Button } from '@pv/ui-kit/button'
import { t } from '@pv/interface/services/i18n'

export const PouchModalContent = observer(() => {
  const { pouchStore, pouchAction } = usePouchContext()
  const currentId = pouchStore.currentPouchId
  return (
    <div>
      <PouchItem
        isSelected={currentId === null}
        pouch={{ name: t('export.pouchMain'), id: null }}
        onSelect={pouchAction.handleSelect}
      />

      {pouchStore.pouches.map((pouch) => {
        return (
          <PouchItem
            isSelected={currentId === pouch.id}
            key={`${pouch.id}-${pouch.name}`}
            pouch={pouch}
            onRemove={pouchAction.handleRemove}
            onSelect={pouchAction.handleSelect}
          />
        )
      })}
      <Button>{t('pouchBlock.add')}</Button>
    </div>
  )
})
