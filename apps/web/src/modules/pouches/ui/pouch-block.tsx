import { PouchId } from '@pv/pouches/core/pouch.entity'
import { PouchModal } from './pouch-modal'
import { PouchSelection } from './pouch-selection'

import './pouch.langs'

type Props = {
  onSelect: (pouchId: PouchId) => void
}

export function PouchBlock({ onSelect }: Props) {
  return (
    <>
      <PouchSelection />
      <PouchModal onSelect={onSelect} />
    </>
  )
}
