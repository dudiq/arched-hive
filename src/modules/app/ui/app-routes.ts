import { RouteEntity } from '@pv/core/entities/route.entity'
import { NotFoundPage } from './not-found-page'

export const appRoutes: RouteEntity[] = [
  {
    route: {},
    component: NotFoundPage,
    documentTitle: 'Not found',
    withHeader: false,
    withNavigation: true,
  },
]
