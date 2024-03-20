import { AnalyticAction } from '@pv/analytic/interface/actions/analytic.action'
import { useInject } from '@pv/app/interface/use-inject'
import { PouchBlock } from '@pv/pouches'

import { observer } from '@repo/service'

export const HeaderPouchBlock = observer(() => {
  const { analyticAction } = useInject({
    analyticAction: AnalyticAction,
  })

  return (
    <PouchBlock
      onSelect={() => {
        analyticAction.reloadAnalytic()
      }}
    />
  )
})
