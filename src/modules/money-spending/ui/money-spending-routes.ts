import { RouteEntity } from '@pv/core/entities/route.entity'
import { MoneySpending } from './money-spending'

export const moneySpendingRoutes: RouteEntity[] = [
  {
    route: {
      path: '/',
    },
    component: MoneySpending,
    documentTitle: 'Money spending',
    withHeader: true,
    withNavigation: true,
  },
]
