import {useInject} from '@pv/modules/app/interface/use-inject';

import { SettingsAction } from './actions/settings.action'
import { SettingsStore } from './stores/settings.store'


export function useSettingsContext(){
  return useInject({
    settingsAction: SettingsAction,
    settingsStore: SettingsStore,
  })
}
