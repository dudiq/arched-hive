import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/constants/routes'
import { t } from '@pv/interface/services/i18n'
import { Categories } from './categories'

export const categoriesRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.categories,
    },
    header: {
      title: () => t('pages.category'),
    },
    component: Categories,
    withHeader: true,
    withNavigation: true,
  },
]
