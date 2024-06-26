import { ImportDataValueObject } from '@pv/settings/core/value-object/import-data.value-object'

export type ExportDatabaseValueObject = {
  dbVersion: number
  stats: {
    expenses: number
    cats: number
    pouch: number
  }
  data: ImportDataValueObject
}
