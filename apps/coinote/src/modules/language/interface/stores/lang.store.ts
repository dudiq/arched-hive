import { getLang,setLang } from '@pv/interface/services/i18n'
import { LocalStorageItem } from '@pv/interface/services/local-storage-item'

import { Store } from '@repo/service'

import type { LanguageEntity } from '@pv/modules/language/core/language.entity'

@Store()
export class LangStore {
  private langStorage = new LocalStorageItem<LanguageEntity>('lang', {
    initialValue: getLang() as LanguageEntity,
  })

  get currentLanguage(): LanguageEntity {
    return this.langStorage.value || (getLang() as LanguageEntity)
  }

  changeLanguage(newLang: LanguageEntity) {
    this.langStorage.set(newLang)
    setLang(newLang)
  }
}
