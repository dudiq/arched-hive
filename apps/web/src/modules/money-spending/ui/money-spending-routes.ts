import { RouteEntity } from '@pv/modules/app/core/route.entity'
import { Routes } from '@pv/constants/routes'
import { t } from '@pv/interface/services/i18n'
import { ExpensesPage } from './pages/expenses-page'
import { ExpenseItemPage } from './pages/expense-item-page'
import { HeaderPouchBlock } from './header-pouch-block'

export const moneySpendingRoutes: RouteEntity[] = [
  {
    route: {
      path: Routes.expense,
    },
    component: ExpensesPage,
    header: {
      title: () => t('pages.expense'),
      component: HeaderPouchBlock,
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
