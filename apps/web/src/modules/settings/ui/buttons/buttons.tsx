import { t } from '@pv/i18n'
import { useInject } from '@pv/service/interface/use-inject'
import { SettingsAction } from '@pv/settings/interface/actions/settings.action'

import { observer } from '@repo/service'
import { Separator, UploadArea } from '@repo/ui-kit'

import { RowBlock } from './row-block'

export const Buttons = observer(() => {
  const { settingsAction } = useInject({
    settingsAction: SettingsAction,
  })

  return (
    <div className="flex flex-col gap-3">
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
      <div className="my-5">
        <Separator />
      </div>
      <RowBlock icon="Trash" onClick={settingsAction.handleDropAllData}>
        <span className="text-red-400 dark:text-red-600">
          {t('settings.dropAll')}
        </span>
      </RowBlock>
    </div>
  )
})
