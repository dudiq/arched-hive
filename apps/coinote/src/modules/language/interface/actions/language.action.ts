import { Action, Inject } from '@repo/service'
import { getLang } from '@pv/interface/services/i18n'
import { LangStore } from '../stores/lang.store'

@Action()
export class LanguageAction {
  constructor(
    private readonly langStore = Inject(LangStore),
  ) {}

  handleChangeLanguage() {
    const currentLang = getLang()
    const newLang = currentLang === 'ru' ? 'en' : 'ru'
    this.langStore.changeLanguage(newLang)
  }
}
