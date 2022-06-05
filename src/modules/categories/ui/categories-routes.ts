import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/contants/routes'
import { Categories } from './categories'

export const categoriesRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.categories,
    },
    component: Categories,
    documentTitle: 'Money spending',
    withHeader: true,
    withNavigation: true,
  },
]
