import { isErr, resultErr, resultOk } from '@repo/result'
import { Adapter, AdapterClass, Inject } from '@repo/service'

import { SettingsErrors } from '../core/errors/settings.errors'

import { SettingsDataProvider } from './settings.data-provider'

import type { ImportDataValueObject } from '../core/value-object/import-data.value-object'

@AdapterClass()
export class SettingsAdapter {
  constructor(private settingsDataProvider = Inject(SettingsDataProvider)) {}

  importData = Adapter(async (input: ImportDataValueObject) => {
    const result = await this.settingsDataProvider.importData(input)
    if (isErr(result))
      return resultErr(new SettingsErrors.ImportResponse(result.error))
    return resultOk(null)
  })

  dropData = Adapter(async () => {
    const result = await this.settingsDataProvider.dropData()
    if (isErr(result))
      return resultErr(new SettingsErrors.DropDataResponse(result.error))
    return resultOk(null)
  })

  getAllData = Adapter(async () => {
    const result = await this.settingsDataProvider.getAllData()
    if (isErr(result))
      return resultErr(new SettingsErrors.LoadDataResponse(result.error))
    return resultOk(result.data)
  })
}
