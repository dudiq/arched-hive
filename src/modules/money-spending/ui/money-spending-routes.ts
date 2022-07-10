import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/contants/routes'
import { t } from '@pv/interface/services/i18n'
import { PouchBlock } from '@pv/modules/pouches'
import { ExpensesPage } from './pages/expenses-page'
import { ExpenseItemPage } from './pages/expense-item-page'

export const moneySpendingRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.expense,
    },
    component: ExpensesPage,
    header: {
      title: () => t('pages.expense'),
      component: PouchBlock,
    },
    withNavigation: true,
  },
  {
    route: {
      path: Routes.expenseItem,
    },
    component: ExpenseItemPage,
  },
]
