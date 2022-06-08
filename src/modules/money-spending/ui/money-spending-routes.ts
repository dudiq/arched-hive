import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/contants/routes'
import { ExpensesPage } from './pages/expenses-page'

export const moneySpendingRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.expense,
    },
    component: ExpensesPage,
    documentTitle: 'Expenses',
    withHeader: true,
    withNavigation: true,
  },
]
