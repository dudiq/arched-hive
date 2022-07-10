import { PouchModal } from './pouch-modal'
import { PouchSelection } from './pouch-selection'
import './pouch.langs'

export function PouchBlock() {
  return (
    <>
      <PouchSelection />
      <PouchModal />
    </>
  )
}
