import { Action, Inject } from '@repo/service'

import { LangStore } from '../stores/lang.store'

import type { LanguageEntity } from '@pv/language'

@Action()
export class LanguageAction {
  constructor(private readonly langStore = Inject(LangStore)) {}

  handleToggleLanguage(): void {
    const currentLang = this.langStore.currentLanguage
    const newLang = currentLang === 'ru' ? 'en' : 'ru'
    this.langStore.changeLanguage(newLang)
  }

  handleChangeLanguage(lang: LanguageEntity): void {
    this.langStore.changeLanguage(lang)
  }
}
