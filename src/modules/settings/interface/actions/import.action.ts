import { Action, Inject } from '@pv/di'
import { ImportFinService } from '../services/import-fin.service'

@Action()
export class ImportAction {
  constructor(
    @Inject()
    private importFinService: ImportFinService,
  ) {}

  handleImportFiles(files: FileList | null) {
    this.importFinService.handleImportFiles(files)
  }
}
