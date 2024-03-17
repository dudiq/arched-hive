import './not-found-page.langs'

import { t } from '@pv/i18n'

export function NotFoundPage() {
  return (
    <div className="flex my-10 justify-center items-center text-sm">
      {t('notFound.title')}
    </div>
  )
}
