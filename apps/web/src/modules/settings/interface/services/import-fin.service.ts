import { t } from '@pv/i18n'
import { MessageBoxService } from '@pv/message-box'
import lz from 'lz-string'

import { isErr } from '@repo/result'
import { Inject, Service } from '@repo/service'

import { SettingsAdapter } from '../../infra/settings.adapter'

import { DropAllService } from './drop-all.service'
import { FileService } from './file.service'

import type { ExportDatabaseValueObject } from '../../core/value-object/export-database.value-object'

@Service()
export class ImportFinService {
  constructor(
    private messageBoxService = Inject(MessageBoxService),
    private fileService = Inject(FileService),
    private settingsAdapter = Inject(SettingsAdapter),
    private dropAllService = Inject(DropAllService),
  ) {}

  private static decompressFromBase64<T>(data: string): T | null {
    try {
      let str = lz.decompressFromBase64(data)
      if (!str) {
        str = data
      }
      return JSON.parse(str)
    } catch (e) {
      return null
    }
  }

  async importFiles(files: FileList | undefined) {
    if (!files || files.length === 0) return

    const content = await this.fileService.readTextFile<string>(files[0])
    const result =
      ImportFinService.decompressFromBase64<ExportDatabaseValueObject>(content)
    if (!result) return
    if (!result.dbVersion) return
    if (!result.data) return

    this.dropAllService.dropRelatedStores()
    const importResult = await this.settingsAdapter.importData(result.data)
    if (isErr(importResult)) {
      await this.messageBoxService.alert(t('settings.importError'))
      return
    }

    await this.messageBoxService.alert(t('settings.importDone'))

    // TODO: add reload data to pouch and all other pages
  }
}
