import { Inject, Service } from '@pv/di'
import { FileService } from '../file.service'

@Service()
export class ExportCsvService {
  constructor(
    @Inject()
    private fileService: FileService,
  ) {}

  private async getSheets(): Promise<Array<{ sheet: string; name: string }>> {
    return []
  }

  async exportData() {
    const now = new Date()
    const dayNow = now.getDate()
    const day = dayNow < 10 ? `0${dayNow}` : dayNow
    const sheetNameTemplate = `coinote.${now.getFullYear()}-${now.getMonth() + 1}-${day}`

    const sheets = await this.getSheets()
    sheets.forEach(({ sheet, name }) => {
      const fileName = `${sheetNameTemplate}.${name}.csv`
      this.fileService.saveToFile(fileName, sheet)
    })
  }
}
