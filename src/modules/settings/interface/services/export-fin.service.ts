import lz from 'lz-string'
import { Inject, Service } from '@pv/di'
import { ExportDbValueObject } from '../core/value-object/export-db.value-object'
import { FileService } from './file.service'

@Service()
export class ExportFinService {
  constructor(
    @Inject()
    private fileService: FileService,
  ) {}

  async exportData() {
    const data = {
      expense: [],
      category: [],
      pouch: [],
    }
    const storeData: ExportDbValueObject = {
      dbVersion: 4,
      data,
      stats: {
        expenses: data.expense.length,
        cats: data.category.length,
        pouch: data.pouch.length,
      },
    }
    try {
      const str = JSON.stringify(storeData)
      const content = lz.compressToBase64(str)
      const now = new Date()
      const fileName = `coinote.${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.fin`
      this.fileService.saveToFile(fileName, content)
    } catch (e) {}
  }
}
