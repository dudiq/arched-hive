import './settings.langs'

import { t } from '@pv/i18n'
import { useLanguageContext } from '@pv/language'
import { useSettingsContext } from '@pv/settings/interface/use-settings-context'
import { useThemeContext } from '@pv/theme'

import { observer } from '@repo/service'
import { BlockLoader, List, ScrollContainer, Toggle } from '@repo/ui-kit'

import { BuildVersion } from './build-version'
import { Buttons } from './buttons'
import { ListBlock } from './list-block'
import { LangSwitch } from './settings-styles'

export const SettingsPage = observer(() => {
  const { themeStore, themeAction } = useThemeContext()
  const { langAction } = useLanguageContext()
  const { settingsStore } = useSettingsContext()
  return (
    <ScrollContainer>
      <List>
        <ListBlock
          onClick={themeAction.handleToggleTheme}
          icon="moon"
          title={t('settings.theme.dark')}
        >
          <Toggle checked={themeStore.currentTheme === 'dark'} />
        </ListBlock>
        <ListBlock
          onClick={langAction.handleChangeLanguage}
          icon="translate"
          title={t('settings.lang.title')}
        >
          <LangSwitch>{t('settings.lang.values')}</LangSwitch>
        </ListBlock>
      </List>
      <Buttons />
      <BuildVersion />
      {!!settingsStore.isLoading && <BlockLoader />}
    </ScrollContainer>
  )
})
