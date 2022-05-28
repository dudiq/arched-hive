import { t } from '@pv/interface/services/i18n'
import { UploadButton } from '@pv/ui-kit/upload-button'
import { Container, DangerRow } from './buttons-styles'
import { RowBlock } from './row-block'

export function Buttons() {
  return (
    <Container>
      <RowBlock>
        <UploadButton>{t('settings.importFin')}</UploadButton>
      </RowBlock>
      <RowBlock>{t('settings.exportFin')}</RowBlock>
      <RowBlock>{t('settings.exportFin')}</RowBlock>
      <RowBlock>{t('settings.exportCsv')}</RowBlock>
      <DangerRow>
        <RowBlock>{t('settings.dropAll')}</RowBlock>
      </DangerRow>
    </Container>
  )
}
