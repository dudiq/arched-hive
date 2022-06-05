import { t } from '@pv/interface/services/i18n'
import { UploadButton } from '@pv/ui-kit/upload-button'
import { useSettingsContext } from '@pv/modules/settings/interface/use-settings-context'
import { observer } from 'mobx-react-lite'
import { Container, DangerRow } from './buttons-styles'
import { RowBlock } from './row-block'

export const Buttons = observer(() => {
  const { settingsAction } = useSettingsContext()
  return (
    <Container>
      <RowBlock icon="upload">
        <UploadButton onChange={settingsAction.handleImportFiles}>
          {t('settings.importFin')}
        </UploadButton>
      </RowBlock>
      <RowBlock icon="download" onClick={settingsAction.handleExportAsFin}>
        {t('settings.exportFin')}
      </RowBlock>
      <RowBlock icon="download" onClick={settingsAction.handleExportAsCsv}>
        {t('settings.exportCsv')}
      </RowBlock>
      <DangerRow onClick={settingsAction.handleDropAllData}>
        <RowBlock icon="trash">{t('settings.dropAll')}</RowBlock>
      </DangerRow>
    </Container>
  )
})
