import { settingsRoutes } from '@pv/modules/settings'
import {moneySpendingRoutes} from "@pv/modules/money-spending";

export const routes = [...settingsRoutes, ...moneySpendingRoutes]
