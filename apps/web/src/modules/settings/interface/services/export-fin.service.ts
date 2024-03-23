import { t } from '@pv/i18n'
import { MessageBoxService } from '@pv/message-box'
import { SettingsAdapter } from '@pv/settings/infra/settings.adapter'
import lz from 'lz-string'

import { isErr } from '@repo/result'
import { Inject, Service } from '@repo/service'

import { FileService } from './file.service'

import type { ExportDatabaseValueObject } from '../../core/value-object/export-database.value-object'

@Service()
export class ExportFinService {
  constructor(
    private messageBoxService= Inject(MessageBoxService),
    private fileService= Inject(FileService),
    private settingsAdapter= Inject(SettingsAdapter),
  ) {}

  private async saveDbToFile(storeData: ExportDatabaseValueObject) {
    try {
      const str = JSON.stringify(storeData)
      const content = lz.compressToBase64(str)
      const now = new Date()
      const fileName = `coinote.${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.fin`
      this.fileService.saveToFile(fileName, content)
    } catch (e) {}
  }

  async exportData() {
    const result = await this.settingsAdapter.getAllData()
    if (isErr(result)) {
      await this.messageBoxService.alert(t('settings.exportError'))
      return
    }

    const data = result.data
    await this.saveDbToFile({
      dbVersion: 4,
      data,
      stats: {
        expenses: data.expense.length,
        cats: data.category.length,
        pouch: data.pouch.length,
      },
    })
  }
}
