import { resultErr, resultOk } from '@repo/result'
import {DataProvider} from '@repo/service';

import { FinansoDb } from './database.client'

import type { ResultErr,ResultOk} from '@repo/result';

@DataProvider()
export class DatabaseDataProvider {
  private databaseClient: FinansoDb = FinansoDb.instance()

  get client(): FinansoDb {
    return this.databaseClient
  }

  ok<T>(result: T): ResultOk<T> {
    return resultOk<T>(result)
  }

  error<T>(result: T): ResultErr<T> {
    return resultErr<T>(result)
  }
}
