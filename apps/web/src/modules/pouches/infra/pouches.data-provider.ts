import { DatabaseDataProvider } from '@pv/database-provider'

import {DataProvider, Inject} from '@repo/service'

import type { PouchEntity } from '@pv/pouches/core/pouch.entity'

function checkDateEnd(item: PouchEntity) {
  return !item.dateEnd
}

@DataProvider()
export class PouchesDataProvider {
  constructor(
    private readonly databaseDataProvider = Inject(DatabaseDataProvider)
  ) {}

  get client() {
    return this.databaseDataProvider.client
  }

  get ok() {
    return this.databaseDataProvider.ok
  }

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
