import './export-csv.langs'

import { t } from '@pv/i18n'
import { MessageBoxService } from '@pv/message-box'
import { SettingsAdapter } from '@pv/settings/infra/settings.adapter'

import { isErr } from '@repo/result'
import { Inject, Service } from '@repo/service'

import { FileService } from '../file.service'

import { SheetsService } from './sheets.service'

@Service()
export class ExportCsvService {
  constructor(
    private messageBoxService = Inject(MessageBoxService),
    private settingsAdapter = Inject(SettingsAdapter),
    private fileService = Inject(FileService),
    private sheetsService = Inject(SheetsService),
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
      console.log('result', result)
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
