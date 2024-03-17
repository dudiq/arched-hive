import { Action, Inject } from '@repo/service'

import { LangStore } from '../stores/lang.store'

@Action()
export class LanguageAction {
  constructor(private readonly langStore = Inject(LangStore)) {}

  handleChangeLanguage() {
    const currentLang = this.langStore.currentLanguage
    const newLang = currentLang === 'ru' ? 'en' : 'ru'
    this.langStore.changeLanguage(newLang)
  }
}
