import { Result } from 'fnscript'
import { Inject, Adapter } from '@pv/di'
import { ImportDataValueObject } from '@pv/modules/settings/core/value-object/import-data.value-object'
import { PromisedResult } from '@pv/di/types'
import {
  SettingsErrorsInstances,
  SettingsErrors,
} from '@pv/modules/settings/core/errors/settings.errors'
import { SettingsDataProvider } from './settings.data-provider'

@Adapter()
export class SettingsAdapter {
  constructor(
    @Inject()
    private settingsDataProvider: SettingsDataProvider,
  ) {}
  async importData(input: ImportDataValueObject): PromisedResult<null, SettingsErrorsInstances> {
    try {
      const { error } = await this.settingsDataProvider.importData(input)

      if (error) return Result.Err(new SettingsErrors.ImportResponse(error))

      return Result.Ok(null)
    } catch (e) {
      return Result.Err(new SettingsErrors.UnexpectedErrorImport(e))
    }
  }

  async dropData(): PromisedResult<null, SettingsErrorsInstances> {
    try {
      const { error } = await this.settingsDataProvider.dropData()
      if (error) return Result.Err(new SettingsErrors.DropDataResponse(error))

      return Result.Ok(null)
    } catch (e) {
      return Result.Err(new SettingsErrors.UnexpectedErrorDropData(e))
    }
  }

  async getAllData(): PromisedResult<ImportDataValueObject, SettingsErrorsInstances> {
    try {
      const { error, data } = await this.settingsDataProvider.getAllData()
      if (error) return Result.Err(new SettingsErrors.LoadDataResponse(error))

      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new SettingsErrors.UnexpectedLoadData(e))
    }
  }
}
