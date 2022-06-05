import { databaseClient, FinansoDb } from './database.client'

export class DatabaseDataProvider {
  private databaseClient: FinansoDb = databaseClient

  get client() {
    return this.databaseClient
  }

  ok<T>(result?: T) {
    return { data: result, error: undefined }
  }
}
