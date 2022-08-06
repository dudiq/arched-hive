import { resultErr, resultOk } from '@pv/modules/result'
import { databaseClient, FinansoDb } from './database.client'

export class DatabaseDataProvider {
  private databaseClient: FinansoDb = databaseClient

  get client() {
    return this.databaseClient
  }

  ok<T>(result: T) {
    return resultOk<T>(result)
  }

  error<T>(result: T) {
    return resultErr<T>(result)
  }
}
