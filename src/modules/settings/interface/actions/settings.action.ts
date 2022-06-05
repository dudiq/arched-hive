import { Action, Inject } from '@pv/di'
import { ImportFinService } from '../services/import-fin.service'
import { ExportFinService } from '../services/export-fin.service'
import { ExportCsvService } from '../services/export-csv.service'
import { DropAllService } from '../services/drop-all.service'
import { SettingsStore } from '../stores/settings.store'

@Action()
export class SettingsAction {
  constructor(
    @Inject()
    private importFinService: ImportFinService,
    @Inject()
    private exportFinService: ExportFinService,
    @Inject()
    private exportCsvService: ExportCsvService,
    @Inject()
    private dropAllService: DropAllService,
    @Inject()
    private settingsStore: SettingsStore,
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
