import {useInject} from '@pv/app/interface/use-inject';

import { PouchAction } from './actions/pouch.action'
import { PouchStore } from './stores/pouch.store'

export function usePouchContext() {
  return useInject({
    pouchStore: PouchStore,
    pouchAction: PouchAction,
  })
}