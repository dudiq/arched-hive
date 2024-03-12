// import { useCurrentRoute } from '@pv/dom/interface/use-current-route'
// import { NotFoundPage } from '@pv/app/ui/not-found-page'

import { observer } from '@repo/service'
// import { Swap } from '@repo/ui-kit'

export const ScreensSwitch = observer(() => {
  // const { currentRoute } = useCurrentRoute()

  // const ScreenComponent = currentRoute?.component
  // const isPageExist = currentRoute && ScreenComponent
  return (
    <>
      {/*<Swap is={!isPageExist} isSlot={<NotFoundPage />}>*/}
      {/*  /!*<Swap is={!currentRoute?.route.path} isSlot={<NotFoundPage />}>*!/*/}
      {/*  /!*  {!!ScreenComponent && <ScreenComponent />}*!/*/}
      {/*  /!*</Swap>*!/*/}
      {/*</Swap>*/}
    </>
  )
})
