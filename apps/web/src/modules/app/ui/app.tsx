import './app.langs'

import { AnalyticPage } from '@pv/analytic/ui/analytic-page'
import { EmptyPage } from '@pv/app/ui/empty-page'
import { NotFoundPage } from '@pv/app/ui/not-found-page'
import { CategoriesPage } from '@pv/categories/ui/categories.page'
import { useFocus } from '@pv/focus'
import { ExpenseItemPage } from '@pv/money-spending/ui/pages/expense-item-page'
import { ExpensesPage } from '@pv/money-spending/ui/pages/expenses-page'
import { Routes } from '@pv/route/interface/routes'
import { BaseRouter } from '@pv/route/ui/base-router'
import { SettingsPage } from '@pv/settings/ui/settings.page'
import { ThemeDefine } from '@pv/theme'
import { Route, Switch } from 'wouter'

import { Lang } from './lang'
import { Loader } from './loader'

export const App = () => {
  useFocus()

  return (
    <>
      <Loader />
      <ThemeDefine />
      <Lang>
        <BaseRouter>
          <Switch>
            <Route
              path={`${Routes.expense}:?params`}
              component={ExpensesPage}
            />
            <Route path={`${Routes.expenseItem}`} component={ExpenseItemPage} />
            <Route
              path={`${Routes.analytic}/:?params`}
              component={AnalyticPage}
            />
            <Route path={Routes.categories} component={CategoriesPage} />
            <Route path={Routes.settings} component={SettingsPage} />
            <Route path={Routes.empty} component={EmptyPage} />
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
        </BaseRouter>
      </Lang>
    </>
  )
}
