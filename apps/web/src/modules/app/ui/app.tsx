import './app.langs'

import { Fragment } from 'react'
import { AnalyticPage } from '@pv/analytic/ui/analytic-page'
import { EmptyPage } from '@pv/app/ui/empty-page'
import { NotFoundPage } from '@pv/app/ui/not-found-page'
import { CategoriesPage } from '@pv/categories/ui/categories.page'
import { useFocus } from '@pv/focus'
import { useLanguageContext } from '@pv/language'
import { ExpenseItemPage } from '@pv/money-spending/ui/pages/expense-item-page'
import { ExpensesPage } from '@pv/money-spending/ui/pages/expenses-page'
import { Routes } from '@pv/route/interface/routes'
import { BaseRouter } from '@pv/route/ui/base-router'
import { SettingsPage } from '@pv/settings/ui/settings.page'
import { ThemeDefine } from '@pv/theme'
import { Route, Switch } from 'wouter'

import { observer } from '@repo/service'

import { Loader } from './loader'

export const App = observer(() => {
  const { langStore } = useLanguageContext()
  useFocus()

  return (
    <Fragment key={langStore.currentLanguage}>
      <Loader />
      <ThemeDefine />
      <BaseRouter>
        <Switch>
          <Route path={`${Routes.expense}:?params`} component={ExpensesPage} />
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
    </Fragment>
  )
})
