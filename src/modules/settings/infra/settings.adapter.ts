import { Inject, Adapter } from '@pv/di'
import { ImportDataValueObject } from '@pv/modules/settings/core/value-object/import-data.value-object'
import {
  SettingsErrorsInstances,
  SettingsErrors,
} from '@pv/modules/settings/core/errors/settings.errors'
import { isErr, PromiseResult, resultErr, resultOk } from '@pv/modules/result'
import { SettingsDataProvider } from './settings.data-provider'

@Adapter()
export class SettingsAdapter {
  constructor(
    @Inject()
    private settingsDataProvider: SettingsDataProvider,
  ) {}
  async importData(input: ImportDataValueObject): PromiseResult<null, SettingsErrorsInstances> {
    try {
      const result = await this.settingsDataProvider.importData(input)

      if (isErr(result)) return resultErr(new SettingsErrors.ImportResponse(result.error))

      return resultOk(null)
    } catch (e) {
      return resultErr(new SettingsErrors.UnexpectedErrorImport(e))
    }
  }

  async dropData(): PromiseResult<null, SettingsErrorsInstances> {
    try {
      const result = await this.settingsDataProvider.dropData()
      if (isErr(result)) return resultErr(new SettingsErrors.DropDataResponse(result.error))

      return resultOk(null)
    } catch (e) {
      return resultErr(new SettingsErrors.UnexpectedErrorDropData(e))
    }
  }

  async getAllData(): PromiseResult<ImportDataValueObject, SettingsErrorsInstances> {
    try {
      const result = await this.settingsDataProvider.getAllData()
      if (isErr(result)) return resultErr(new SettingsErrors.LoadDataResponse(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new SettingsErrors.UnexpectedLoadData(e))
    }
  }
}
