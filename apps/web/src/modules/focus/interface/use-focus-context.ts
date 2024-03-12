import {useInject} from '@pv/app/interface/use-inject';

import { FocusAction } from './action/focus.action'
import { FocusStore } from './stores/focus.store'

export function useFocusContext() {
  return useInject({
    focusStore: FocusStore,
    focusAction: FocusAction,
  })
}
