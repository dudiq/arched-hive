import { Store } from '@pv/di'
import { LocalStorageItem } from '@pv/interface/services/local-storage-item'
import { setLang, getLang } from '@pv/interface/services/i18n'
import { LanguageEntity } from '@pv/modules/language/core/language.entity'

@Store()
export class LangStore {
  private langStorage = new LocalStorageItem<LanguageEntity>('@lang', {
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
