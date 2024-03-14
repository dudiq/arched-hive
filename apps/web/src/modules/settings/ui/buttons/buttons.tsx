import { t } from '@pv/i18n'
import { useSettingsContext } from '@pv/settings/interface/use-settings-context'

import { observer } from '@repo/service'
import { UploadArea } from '@repo/ui-kit'

import { Container, DangerRow } from './buttons-styles'
import { RowBlock } from './row-block'

export const Buttons = observer(() => {
  const { settingsAction } = useSettingsContext()
  return (
    <Container>
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
      <DangerRow onClick={settingsAction.handleDropAllData}>
        <RowBlock icon="Trash">{t('settings.dropAll')}</RowBlock>
      </DangerRow>
    </Container>
  )
})
