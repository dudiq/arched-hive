import {useInject} from '@pv/modules/app/interface/use-inject';

import { RoutesStore } from './stores/routes.store'

export function useRoutesContext(){
  return useInject({
    routesStore: RoutesStore,
  })
}
