import { DataProvider } from '@pv/di'
import { DatabaseDataProvider } from '@pv/infra/database.data-provider'
import { PouchEntity } from '@pv/core/entities/pouch.entity'

function checkDateEnd(item: PouchEntity) {
  return !item.dateEnd
}

@DataProvider()
export class PouchesDataProvider extends DatabaseDataProvider {
  async getPouches() {
    const pouches = await this.client.pouch.filter(checkDateEnd).toArray()
    return this.ok(pouches)
  }

  async addPouch(pouch: PouchEntity) {
    const result = await this.client.pouch.add(pouch)

    return this.ok(result)
  }

  async removePouch(pouchId: string) {
    const result = await this.client.pouch.update(pouchId, {
      dateEnd: Date.now(),
    })

    return this.ok(!!result)
  }
}
