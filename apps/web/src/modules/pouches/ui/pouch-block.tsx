import './pouch.langs'

import { PouchModal } from './pouch-modal'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

type Props = {
  onSelect: (pouchId: PouchId) => void
}

export function PouchBlock({ onSelect }: Props) {
  return <PouchModal onSelect={onSelect} />
}
