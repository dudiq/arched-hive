import { t } from '@pv/i18n'

import { buildVersion } from '@repo/build-version'

import { Container } from './build-version-styles'

const buildTime = buildVersion.date
const hash = buildVersion.hash.substring(0, 6)

export function BuildVersion() {
  return (
    <Container>
      <div>
        {t('settings.version')}: {buildVersion.version}
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
