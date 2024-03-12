import { DatabaseDataProvider } from '@pv/modules/database-provider'

import {DataProvider, Inject} from '@repo/service'

import type { ImportDataValueObject } from '@pv/modules/settings/core/value-object/import-data.value-object'

@DataProvider()
export class SettingsDataProvider {
  constructor(
    private readonly databaseDataProvider = Inject(DatabaseDataProvider)
  ) {}

  get client() {
    return this.databaseDataProvider.client
  }

  get ok() {
    return this.databaseDataProvider.ok
  }

  async importData(input: ImportDataValueObject) {
    await Promise.all([
      this.client.expense.clear(),
      this.client.category.clear(),
      this.client.pouch.clear(),
    ])

    await Promise.all([
      this.client.pouch.bulkAdd(input.pouch),
      this.client.category.bulkAdd(input.category),
      this.client.expense.bulkAdd(input.expense),
    ])

    return this.ok(true)
  }

  async dropData() {
    await Promise.all([
      this.client.expense.clear(),
      this.client.category.clear(),
      this.client.pouch.clear(),
    ])

    return this.ok(true)
  }

  async getAllData() {
    const [expense, category, pouch] = await Promise.all([
      this.client.expense.orderBy('id').toArray(),
      this.client.category.orderBy('id').toArray(),
      this.client.pouch.orderBy('id').toArray(),
    ])

    return this.ok<ImportDataValueObject>({
      expense,
      category,
      pouch,
    })
  }
}
