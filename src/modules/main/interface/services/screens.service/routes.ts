import { settingsRoutes } from '@pv/modules/settings'
import { moneySpendingRoutes } from '@pv/modules/money-spending'
import { appRoutes } from '@pv/modules/app'
import { categoriesRoutes } from '@pv/modules/categories'

export const routes = [...settingsRoutes, ...moneySpendingRoutes, ...categoriesRoutes, ...appRoutes]
