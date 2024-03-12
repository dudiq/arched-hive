import { Routes } from '@pv/constants/routes'
import { t } from '@pv/interface/services/i18n'

import { Separator } from '@repo/ui-kit'

import { NaviItem } from './navi-item'
import { Container } from './navigation-styles'

export function Navigation() {
  return (
    <>
      <Separator />
      <Container>
        <NaviItem
          path={Routes.expense}
          isMatch
          icon="fea"
          title={t('pages.expense')}
        />
        <NaviItem
          path={Routes.analytic}
          icon="activity"
          title={t('pages.analytic')}
        />
        <NaviItem
          path={Routes.categories}
          icon="layers"
          title={t('pages.category')}
        />
        <NaviItem
          path={Routes.settings}
          icon="settings"
          title={t('pages.settings')}
        />
      </Container>
    </>
  )
}
