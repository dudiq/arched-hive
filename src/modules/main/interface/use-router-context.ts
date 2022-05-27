import { hookContextFactory } from '@pv/interface/services/hook-context-factory'

import { RoutesStore } from './stores/routes.store'

export const { useModuleContext: useRoutesContext } = hookContextFactory({
  routesStore: RoutesStore,
})
