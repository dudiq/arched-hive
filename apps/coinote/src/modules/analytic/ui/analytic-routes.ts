import { RouteEntity } from '@pv/modules/app/core/route.entity'
import { Routes } from '@pv/constants/routes'
import { t } from '@pv/interface/services/i18n'
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
