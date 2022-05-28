import { Toggle } from '@pv/ui-kit/toggle'
import { observer } from 'mobx-react-lite'
import { useThemeContext } from '@pv/modules/theme'
import { useLanguageContext } from '@pv/modules/language'
import { List } from '@pv/ui-kit/list'
import { t } from '@pv/interface/services/i18n'
import { BuildVersion } from './build-version'
import { ListBlock } from './list-block'
import { LangSwitch } from './settings-styles'
import { Buttons } from './buttons'

import './settings.langs'

export const Settings = observer(() => {
  const { themeStore, themeAction } = useThemeContext()
  const { langAction } = useLanguageContext()
  return (
    <>
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
          <LangSwitch>{t(`settings.lang.values`)}</LangSwitch>
        </ListBlock>
      </List>
      <Buttons />
      <BuildVersion />
    </>
  )
})
