import { Router } from 'wouter-preact'
// import {Layout} from "./layout";
import { ScreensSwitch } from './screens-switch'
import { HistoryAdapter } from './history-adapter'

export function Main() {
  return (
    <Router>
      <HistoryAdapter />
      <ScreensSwitch />
      {/*<Layout*/}
      {/*  contentSlot={<ScreensSwitch/>}*/}
      {/*/>*/}
    </Router>
  )
}
