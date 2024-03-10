import { Action, Inject } from '@repo/service'

import { DropAllService } from '../services/drop-all.service'
import { ExportCsvService } from '../services/export-csv.service'
import { ExportFinService } from '../services/export-fin.service'
import { ImportFinService } from '../services/import-fin.service'
import { SettingsStore } from '../stores/settings.store'

@Action()
export class SettingsAction {
  constructor(
    private importFinService= Inject(ImportFinService),
    private exportFinService= Inject(ExportFinService),
    private exportCsvService= Inject(ExportCsvService),
    private dropAllService= Inject(DropAllService),
    private settingsStore= Inject(SettingsStore),
  ) {}

  async handleImportFiles(files: FileList | null) {
    this.settingsStore.setIsLoading(true)
    await this.importFinService.importFiles(files)
    this.settingsStore.setIsLoading(false)
  }

  async handleExportAsFin() {
    this.settingsStore.setIsLoading(true)
    await this.exportFinService.exportData()
    this.settingsStore.setIsLoading(false)
  }

  async handleExportAsCsv() {
    this.settingsStore.setIsLoading(true)
    await this.exportCsvService.exportData()
    this.settingsStore.setIsLoading(false)
  }

  async handleDropAllData() {
    this.settingsStore.setIsLoading(true)
    await this.dropAllService.dropData()
    this.settingsStore.setIsLoading(false)
  }
}
