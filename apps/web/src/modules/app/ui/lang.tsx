import { Fragment } from 'react'
import { LangStore } from '@pv/language'
import { useInject } from '@pv/service/interface/use-inject'

import { observer } from '@repo/service'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Lang = observer(({ children }: Props) => {
  const { langStore } = useInject({
    langStore: LangStore,
  })

  return <Fragment key={langStore.currentLanguage}>{children}</Fragment>
})
