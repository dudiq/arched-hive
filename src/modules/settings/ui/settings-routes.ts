import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/constants/routes'
import { t } from '@pv/interface/services/i18n'
import { Settings } from './settings'

export const settingsRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.settings,
    },
    header: {
      title: () => t('pages.settings'),
    },
    component: Settings,
    withHeader: true,
    withNavigation: true,
  },
]
