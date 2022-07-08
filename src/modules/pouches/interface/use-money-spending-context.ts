import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { PouchStore } from './stores/pouch.store'
import { PouchAction } from './actions/pouch.action'

export const { useModuleContext: usePouchContext } = hookContextFactory({
  pouchStore: PouchStore,
  pouchAction: PouchAction,
})
