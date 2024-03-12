import { RouteEntity } from '@pv/app/core/route.entity'
import { Routes } from '@pv/route/interface/routes'
import { t } from '@pv/i18n'
import { SettingsPage } from './settings.page'

export const settingsRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.settings,
    },
    header: {
      title: () => t('pages.settings'),
    },
    component: SettingsPage,
    withHeader: true,
    withNavigation: true,
  },
]
