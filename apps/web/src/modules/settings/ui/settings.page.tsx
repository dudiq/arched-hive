import './settings.langs'

import { Footer } from '@pv/footer/ui'
import { Header } from '@pv/header/ui'
import { t } from '@pv/i18n'
import { useLanguageContext } from '@pv/language'
import { Layout } from '@pv/layout/ui'
import { useSettingsContext } from '@pv/settings/interface/use-settings-context'
import { useThemeContext } from '@pv/theme'

import { observer } from '@repo/service'
import { BlockLoader, Icon, RadioButton, Toggle } from '@repo/ui-kit'

import { BuildVersion } from './build-version'
import { Buttons } from './buttons'

export const SettingsPage = observer(() => {
  const { themeStore, themeAction } = useThemeContext()
  const { langAction, langStore } = useLanguageContext()
  const { settingsStore } = useSettingsContext()

  return (
    <>
      <Layout
        headerSlot={<Header title={t('pages.settings')} />}
        footerSlot={<Footer />}
      >
        <div className="flex flex-col gap-4 px-4">
          <div
            className="flex gap-2 items-center mt-4 cursor-pointer"
            onClick={themeAction.handleToggleTheme}
          >
            <div className="text-gray-400">
              <Icon name="Moon" />
            </div>
            <div>{t('settings.theme.dark')}</div>
            <Toggle checked={themeStore.currentTheme === 'dark'} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-gray-400">
                <Icon name="Translate" />
              </div>
              {t('settings.lang.title')}
            </div>
            <div className="flex gap-4 flex-col ml-4">
              <RadioButton
                checkValue={langStore.currentLanguage}
                name="lang"
                value="en"
                onChange={langAction.handleToggleLanguage}
              >
                {t('settings.lang.en')}
              </RadioButton>
              <RadioButton
                checkValue={langStore.currentLanguage}
                name="lang"
                value="ru"
                onChange={langAction.handleToggleLanguage}
              >
                {t('settings.lang.ru')}
              </RadioButton>
            </div>
          </div>
          <Buttons />
          <div className="text-right">
            <BuildVersion />
          </div>
        </div>
      </Layout>
      {!!settingsStore.isLoading && <BlockLoader />}
    </>
  )
})
