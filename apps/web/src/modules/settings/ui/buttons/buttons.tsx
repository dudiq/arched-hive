import { t } from '@pv/i18n'
import { useSettingsContext } from '@pv/settings/interface/use-settings-context'

import { observer } from '@repo/service'
import { UploadArea } from '@repo/ui-kit'

import { RowBlock } from './row-block'

export const Buttons = observer(() => {
  const { settingsAction } = useSettingsContext()
  return (
    <div>
      <RowBlock icon="Upload">
        <UploadArea onChange={settingsAction.handleImportFiles}>
          {t('settings.importFin')}
        </UploadArea>
      </RowBlock>
      <RowBlock icon="Download" onClick={settingsAction.handleExportAsFin}>
        {t('settings.exportFin')}
      </RowBlock>
      <RowBlock icon="Download" onClick={settingsAction.handleExportAsCsv}>
        {t('settings.exportCsv')}
      </RowBlock>

      <RowBlock icon="Trash" onClick={settingsAction.handleDropAllData}>
        {t('settings.dropAll')}
      </RowBlock>
    </div>
  )
})
