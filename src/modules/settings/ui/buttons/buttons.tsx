import { t } from '@pv/interface/services/i18n'
import { UploadButton } from '@pv/ui-kit/upload-button'
import { useSettingsContext } from '@pv/modules/settings/interface/use-settings-context'
import { observer } from 'mobx-react-lite'
import { Container, DangerRow } from './buttons-styles'
import { RowBlock } from './row-block'

export const Buttons = observer(() => {
  const { importAction } = useSettingsContext()
  return (
    <Container>
      <RowBlock>
        <UploadButton onChange={importAction.handleImportFiles}>
          {t('settings.importFin')}
        </UploadButton>
      </RowBlock>
      <RowBlock>{t('settings.exportFin')}</RowBlock>
      <RowBlock>{t('settings.exportCsv')}</RowBlock>
      <DangerRow>
        <RowBlock>{t('settings.dropAll')}</RowBlock>
      </DangerRow>
    </Container>
  )
})
