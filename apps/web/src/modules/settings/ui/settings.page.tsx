import './settings.langs'

import { Footer } from '@pv/footer/ui'
import { Header } from '@pv/header/ui'
import { t } from '@pv/i18n'
import { handleToggleLanguage, LangStore } from '@pv/language'
import { Layout } from '@pv/layout/ui'
import { useInject } from '@pv/service/interface/use-inject'
import { handleToggleTheme, ThemeStore } from '@pv/theme'

import { observer } from '@repo/service'
import { BlockLoader, Icon, RadioButton, Toggle } from '@repo/ui-kit'

import { SettingsStore } from '../interface/stores/settings.store'

import { BuildVersion } from './build-version'
import { Buttons } from './buttons'

export const SettingsPage = observer(() => {
  const { langStore, themeStore, settingsStore } = useInject({
    langStore: LangStore,
    themeStore: ThemeStore,
    settingsStore: SettingsStore,
  })

  return (
    <>
      <Layout
        headerSlot={<Header title={t('pages.settings')} />}
        footerSlot={<Footer />}
      >
        <div className="flex flex-col gap-4 px-4">
          <div
            className="flex gap-2 items-center mt-4 cursor-pointer"
            onClick={handleToggleTheme}
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
                onChange={handleToggleLanguage}
              >
                {t('settings.lang.en')}
              </RadioButton>
              <RadioButton
                checkValue={langStore.currentLanguage}
                name="lang"
                value="ru"
                onChange={handleToggleLanguage}
              >
                {t('settings.lang.ru')}
              </RadioButton>
            </div>
          </div>
          <Buttons />
          <div className="text-right mt-4">
            <BuildVersion />
          </div>
        </div>
      </Layout>
      {!!settingsStore.isLoading && <BlockLoader />}
    </>
  )
})
