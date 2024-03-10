import { observer } from '@repo/service'
import { usePouchContext } from '@pv/modules/pouches/interface/use-pouch-context'
import { Link } from '@pv/ui-kit/link'

export const PouchSelection = observer(() => {
  const { pouchStore, pouchAction } = usePouchContext()

  return (
    <>
      <Link icon="wallet" onClick={pouchAction.handleOpenPouchesList}>
        {pouchStore.currentPouchName}
      </Link>
    </>
  )
})
