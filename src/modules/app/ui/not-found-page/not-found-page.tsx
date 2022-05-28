import { t } from '@pv/interface/services/i18n'
import { Container } from './not-found-page-styles'

import './not-found-page.langs'

export function NotFoundPage() {
  return <Container>{t('notFound.title')}</Container>
}
