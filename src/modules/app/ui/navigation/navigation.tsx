import { t } from '@pv/interface/services/i18n'
import { Separator } from '@pv/ui-kit/separator'
import { Container } from './navigation-styles'
import { NaviItem } from './navi-item'

export function Navigation() {
  return (
    <>
      <Separator />
      <Container>
        <NaviItem path="/" isMatch icon="fea" title={t('pages.expense')} />
        <NaviItem path="/analytic" icon="activity" title={t('pages.analytic')} />
        <NaviItem path="/category" icon="layers" title={t('pages.category')} />
        <NaviItem path="/settings" icon="settings" title={t('pages.settings')} />
      </Container>
    </>
  )
}
