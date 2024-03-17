import { t } from '@pv/i18n'
import { Routes } from '@pv/route/interface/routes'
import { useLocation } from 'wouter'

import { NaviItem } from './navi-item'

export function Footer() {
  const [location, setLocation] = useLocation()

  console.log('location', {
    location,
  })

  return (
    <div className="flex w-full">
      <NaviItem
        isActive={location === Routes.expense}
        icon="Fea"
        title={t('pages.expense')}
        onClick={() => setLocation(Routes.expense)}
      />
      <NaviItem
        isActive={location.startsWith(Routes.analytic)}
        icon="Activity"
        title={t('pages.analytic')}
        onClick={() => setLocation(Routes.analytic)}
      />
      <NaviItem
        isActive={location.startsWith(Routes.categories)}
        icon="Layers"
        title={t('pages.category')}
        onClick={() => setLocation(Routes.categories)}
      />
      <NaviItem
        isActive={location.startsWith(Routes.settings)}
        icon="Settings"
        title={t('pages.settings')}
        onClick={() => setLocation(Routes.settings)}
      />
    </div>
  )
}
