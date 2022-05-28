import { settingsRoutes } from '@pv/modules/settings'
import { moneySpendingRoutes } from '@pv/modules/money-spending'
import { appRoutes } from '@pv/modules/app'

export const routes = [...settingsRoutes, ...moneySpendingRoutes, ...appRoutes]
