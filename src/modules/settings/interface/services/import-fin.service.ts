import lz from 'lz-string'
import { Inject, Service } from '@pv/di'
import { ExportDbValueObject } from '../core/value-object/export-db.value-object'
import { FileService } from './file.service'

@Service()
export class ImportFinService {
  constructor(
    @Inject()
    private fileService: FileService,
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

  async handleImportFiles(files: FileList | null) {
    if (!files) return

    const list = []
    for (let i = 0, l = files.length; i < l; i++) {
      list.push(this.fileService.readTextFile<string>(files[i]))
    }
    const filesContentList = await Promise.all(list)
    filesContentList.forEach((content: string) => {
      const result = ImportFinService.decompressFromBase64<ExportDbValueObject>(content)
      if (!result) return
      if (!result.dbVersion) return
      if (!result.data) return
    })
  }
}
