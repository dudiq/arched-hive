import { getLang, setLang } from '@pv/i18n'

import { LocalStorageItem, Store } from '@repo/service'

import type { LanguageEntity } from '@pv/language/core/language.entity'

const DEFAULT_LANG: LanguageEntity = 'en'

const langStorage = new LocalStorageItem<LanguageEntity>('lang', {
  initialValue: (getLang() as LanguageEntity) || DEFAULT_LANG,
})

if (langStorage.value) {
  setLang(langStorage.value)
}

@Store()
export class LangStore {
  private langStorage = langStorage

  get currentLanguage(): LanguageEntity {
    return this.langStorage.value || DEFAULT_LANG
  }

  changeLanguage(newLang: LanguageEntity): void {
    this.langStorage.set(newLang)
    setLang(newLang)
  }
}
