import { PouchBlock } from '@pv/modules/pouches'
import { observer } from '@repo/service'
import { useAnalyticContext } from '@pv/modules/analytic/interface/use-analytic-context'

export const HeaderPouchBlock = observer(() => {
  const { analyticAction } = useAnalyticContext()

  return (
    <PouchBlock
      onSelect={() => {
        analyticAction.reloadAnalytic()
      }}
    />
  )
})
