import { AnalyticAction } from '@pv/analytic/interface/actions/analytic.action'
import { PouchBlock } from '@pv/pouches'
import { useInject } from '@pv/service/interface/use-inject'

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
