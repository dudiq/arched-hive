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
    documentTitle: 'Empty data',
    withHeader: false,
    withNavigation: true,
  },
  {
    route: {},
    component: NotFoundPage,
    documentTitle: 'Not found',
    withHeader: false,
    withNavigation: true,
  },
]
