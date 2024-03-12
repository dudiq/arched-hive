import { RouteEntity } from '@pv/app/core/route.entity'
import { Routes } from '@pv/route/interface/routes'
import { t } from '@pv/i18n'
import { AnalyticPage } from './analytic-page'
import { HeaderPouchBlock } from './header-pouch-block'

export const analyticRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.analytic,
    },
    component: AnalyticPage,
    header: {
      title: () => t('pages.analytic'),
      component: HeaderPouchBlock,
    },
    withNavigation: true,
  },
]
