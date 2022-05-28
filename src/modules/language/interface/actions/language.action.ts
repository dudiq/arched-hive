import { Action, Inject } from '@pv/di'
import { getLang } from '@pv/interface/services/i18n'
import { LangStore } from '../stores/lang.store'

@Action()
export class LanguageAction {
  constructor(
    @Inject()
    private readonly langStore: LangStore,
  ) {}

  handleChangeLanguage() {
    const currentLang = getLang()
    const newLang = currentLang === 'ru' ? 'en' : 'ru'
    this.langStore.changeLanguage(newLang)
  }
}
