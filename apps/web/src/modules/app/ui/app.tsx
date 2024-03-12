import './app.langs'

import { useFocus } from '@pv/modules/focus'
import { useLanguageContext } from '@pv/modules/language'
import { ThemeDefine } from '@pv/modules/theme'

import {observer} from '@repo/service';

import { BaseRouter } from './base-router'
import { Header } from './header'
import { Layout } from './layout'
import { Loader } from './loader'
import { Navigation } from './navigation'
import { ScreensSwitch } from './screens-switch'

export const App = observer(() => {
  const { langStore } = useLanguageContext()
  useFocus()
  return (
    <>
      <Loader />
      <ThemeDefine />
      <BaseRouter>
        <Layout
          key={langStore.currentLanguage}
          headerSlot={<Header />}
          contentSlot={<ScreensSwitch />}
          footerSlot={<Navigation />}
        />
      </BaseRouter>
    </>
  )
})
