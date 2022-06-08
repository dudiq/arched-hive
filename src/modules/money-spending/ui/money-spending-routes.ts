import { RouteEntity } from '@pv/core/entities/route.entity'
import { Routes } from '@pv/contants/routes'
import { ExpensesPage } from './pages/expenses-page'
import { ExpenseItemPage } from './pages/expense-item-page'

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
  {
    route: {
      path: Routes.expenseItem,
    },
    component: ExpenseItemPage,
    documentTitle: 'Expense',
  },
]
