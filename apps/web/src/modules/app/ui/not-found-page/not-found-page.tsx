import './not-found-page.langs'

import { t } from '@pv/i18n'

import { Container } from './not-found-page-styles'

export function NotFoundPage() {
  return <Container>{t('notFound.title')}</Container>
}
