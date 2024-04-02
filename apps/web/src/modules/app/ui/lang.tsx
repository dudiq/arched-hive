import { Fragment } from 'react'
import { useLanguageContext } from '@pv/language'

import { observer } from '@repo/service'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Lang = observer(({ children }: Props) => {
  const { langStore } = useLanguageContext()
  return <Fragment key={langStore.currentLanguage}>{children}</Fragment>
})
