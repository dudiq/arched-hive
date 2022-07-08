import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/contants/routes'
import { NotFoundPage } from './not-found-page'
import { EmptyPage } from './empty-page'

export const appRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.empty,
    },
    component: EmptyPage,
    withNavigation: true,
  },
  {
    route: {},
    component: NotFoundPage,
    withNavigation: true,
  },
]
