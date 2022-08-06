import { Inject, Service } from '@pv/di'
import { t } from '@pv/interface/services/i18n'
import { MessageBoxService } from '@pv/modules/message-box'
import { SettingsAdapter } from '@pv/modules/settings/infra/settings.adapter'
import { isErr } from '@pv/modules/result'
import { FileService } from '../file.service'
import { SheetsService } from './sheets.service'

import './export-csv.langs'

@Service()
export class ExportCsvService {
  constructor(
    @Inject()
    private messageBoxService: MessageBoxService,
    @Inject()
    private settingsAdapter: SettingsAdapter,
    @Inject()
    private fileService: FileService,
    @Inject()
    private sheetsService: SheetsService,
  ) {}

  private static getFileName(name: string) {
    const now = new Date()
    const dayNow = now.getDate()
    const day = dayNow < 10 ? `0${dayNow}` : dayNow
    const template = `coinote.${now.getFullYear()}-${now.getMonth() + 1}-${day}`
    return `${template}.${name}.csv`
  }

  async exportData() {
    const result = await this.settingsAdapter.getAllData()
    if (isErr(result)) {
      await this.messageBoxService.alert(t('settings.exportError'))
      return
    }

    const data = result.data

    const sheets = this.sheetsService.getSheets(data)
    sheets.forEach(({ sheet, name }) => {
      const fileName = ExportCsvService.getFileName(name)
      this.fileService.saveToFile(fileName, sheet)
    })
  }
}
