import './not-found-page.langs'

import { t } from '@pv/i18n'
import { Routes } from '@pv/route/interface/routes'
import { Link } from 'wouter'

import { Button } from '@repo/ui-kit'

export function NotFoundPage() {
  return (
    <div className="flex flex-col gap-2 my-10 justify-center items-center text-sm">
      <div>{t('notFound.title')}</div>
      <Link href={Routes.expense}>
        <Button>{t('notFound.goToMain')}</Button>
      </Link>
    </div>
  )
}
