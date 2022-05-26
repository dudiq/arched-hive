import { RouteEntity } from '@pv/core/entities/route.entity'
import { Settings } from '@pv/modules/settings/ui/settings'

export const settingsRoutes: RouteEntity[] = [
  {
    route: {
      path: '/settings',
    },
    component: Settings,
    documentTitle: 'Settings',
  },
]
