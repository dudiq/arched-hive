import { DataProvider } from '@pv/di'
import { DatabaseDataProvider } from '@pv/infra/database.data-provider'

@DataProvider()
export class PouchesDataProvider extends DatabaseDataProvider {
  async getPouches() {
    const pouches = await this.client.pouch.toArray()
    return this.ok(pouches)
  }
}
