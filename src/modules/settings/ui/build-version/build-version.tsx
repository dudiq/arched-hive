import { t } from '@pv/interface/services/i18n'
import { buildVersion } from '@pv/build-version'
import { Container } from './build-version-styles'

const buildTime = buildVersion.buildTime
const hash = buildVersion.changeset.substring(0, 6)

export function BuildVersion() {
  return (
    <Container>
      <div>
        {t(`settings.version`)}: {buildVersion.version}
        {' | '}
        {hash || ''}
      </div>
      <div>
        {t('settings.build')}:{' '}
        {`${buildTime.toLocaleTimeString()} | ${buildTime.toLocaleDateString()}`}
      </div>
    </Container>
  )
}
