import { EmptyAction } from './actions/empty.action'
import { NavigationAction } from './actions/navigation.action'
import { EmptyStore } from './stores/empty.store'
import {useInject} from './use-inject';

export function useAppContext() {
  return useInject({
    navigationAction: NavigationAction,
    emptyAction: EmptyAction,
    emptyStore: EmptyStore,
  })
}
