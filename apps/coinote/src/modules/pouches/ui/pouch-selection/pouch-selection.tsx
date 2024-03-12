import { usePouchContext } from '@pv/modules/pouches/interface/use-pouch-context'

import { observer } from '@repo/service'
import { Link } from '@repo/ui-kit'

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
