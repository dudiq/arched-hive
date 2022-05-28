import { RouteEntity } from '@pv/core/entities/route.entity'
import { Settings } from './settings'

export const settingsRoutes: RouteEntity[] = [
  {
    route: {
      path: '/settings',
    },
    component: Settings,
    documentTitle: 'Settings',
    withHeader: true,
    withNavigation: true,
  },
]
