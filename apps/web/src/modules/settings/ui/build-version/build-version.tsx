import { t } from '@pv/i18n'

import { buildVersion } from '@repo/build-version'

const buildTime = buildVersion.date
const hash = buildVersion.hash.substring(0, 6)

export function BuildVersion() {
  return (
    <div className="text-xs text-gray-500">
      <div>
        {t('settings.version')}: {buildVersion.version}
        {' | '}
        {hash || ''}
      </div>
      <div>
        {t('settings.build')}:{' '}
        {`${buildTime.toLocaleTimeString()} | ${buildTime.toLocaleDateString()}`}
      </div>
    </div>
  )
}
