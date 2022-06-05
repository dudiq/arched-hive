import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/contants/routes'
import { Settings } from './settings'

export const settingsRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.settings,
    },
    component: Settings,
    documentTitle: 'Settings',
    withHeader: true,
    withNavigation: true,
  },
]
