import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/contants/routes'
import { MoneySpending } from './money-spending'

export const moneySpendingRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.expense,
    },
    component: MoneySpending,
    documentTitle: 'Money spending',
    withHeader: true,
    withNavigation: true,
  },
]
