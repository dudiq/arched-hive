import { observer } from 'mobx-react-lite'
import { usePouchContext } from '@pv/modules/pouches/interface/use-pouch-context'
import { PouchItem } from '@pv/modules/pouches/ui/pouch-modal/pouch-item'

export const PouchModalContent = observer(() => {
  const { pouchStore, pouchAction } = usePouchContext()
  return (
    <div>
      {pouchStore.pouches.map((pouch) => {
        return (
          <PouchItem
            key={`${pouch.id}-${pouch.name}`}
            pouch={pouch}
            onRemove={pouchAction.handleRemove}
          />
        )
      })}
    </div>
  )
})
