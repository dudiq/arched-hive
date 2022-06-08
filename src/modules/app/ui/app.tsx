import { Router } from 'wouter-preact'
import { ThemeDefine } from '@pv/modules/theme'
import { useLanguageContext } from '@pv/modules/language'
import { observer } from 'mobx-react-lite'
import { useFocus } from '@pv/modules/focus'
import { Layout } from './layout'
import { ScreensSwitch } from './screens-switch'
import { HistoryAdapter } from './history-adapter'
import { Header } from './header'
import { Navigation } from './navigation'
import { Loader } from './loader'
import './app.langs'

export const App = observer(() => {
  const { langStore } = useLanguageContext()
  useFocus()
  return (
    <>
      <Loader />
      <ThemeDefine />
      <Router>
        <HistoryAdapter />
        <Layout
          key={langStore.currentLanguage}
          headerSlot={<Header />}
          contentSlot={<ScreensSwitch />}
          footerSlot={<Navigation />}
        />
      </Router>
    </>
  )
})
