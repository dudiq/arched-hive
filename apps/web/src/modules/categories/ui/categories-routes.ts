import { RouteEntity } from '@pv/app/core/route.entity'
import { Routes } from '@pv/route/interface/routes'
import { t } from '@pv/i18n'
import { CategoriesPage } from './categories.page'

export const categoriesRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.categories,
    },
    header: {
      title: () => t('pages.category'),
    },
    component: CategoriesPage,
    withHeader: true,
    withNavigation: true,
  },
]
