import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/constants/routes'
import { t } from '@pv/interface/services/i18n'
import { PouchBlock } from '@pv/modules/pouches'
import { AnalyticPage } from './analytic-page'

export const analyticRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.analytic,
    },
    component: AnalyticPage,
    header: {
      title: () => t('pages.analytic'),
      component: PouchBlock,
    },
    withNavigation: true,
  },
]
