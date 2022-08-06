import lz from 'lz-string'
import { Inject, Service } from '@pv/di'
import { SettingsAdapter } from '@pv/modules/settings/infra/settings.adapter'
import { t } from '@pv/interface/services/i18n'
import { MessageBoxService } from '@pv/modules/message-box'
import { isErr } from '@pv/modules/result'
import { ExportDatabaseValueObject } from '../../core/value-object/export-database.value-object'
import { FileService } from './file.service'

@Service()
export class ExportFinService {
  constructor(
    @Inject()
    private messageBoxService: MessageBoxService,
    @Inject()
    private fileService: FileService,
    @Inject()
    private settingsAdapter: SettingsAdapter,
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
