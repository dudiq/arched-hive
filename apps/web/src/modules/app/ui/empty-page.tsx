import { EmptyAction } from '@pv/app/interface/actions/empty.action'
import { EmptyStore } from '@pv/app/interface/stores/empty.store'
import { useInject } from '@pv/app/interface/use-inject'
import { t } from '@pv/i18n'

import { observer } from '@repo/service'
import { Button, RadioButton } from '@repo/ui-kit'

import type { CategoriesDefaultEntity } from '@pv/app/core/categories-default.entity'

const EMPTY_CATEGORY = 'category'

export const EmptyPage = observer(() => {
  const { emptyAction, emptyStore } = useInject({
    emptyAction: EmptyAction,
    emptyStore: EmptyStore,
  })

  return (
    <div className="m-2 flex flex-col gap-4 max-w-80 mx-auto w-full">
      <div className="text-2xl">{t('firstView.t')}</div>
      <div>{t('firstView.select')}</div>
      <div className="flex flex-col gap-2">
        <RadioButton
          checkValue={emptyStore.selectedDefaultCategories}
          name={EMPTY_CATEGORY}
          value={'ru'}
          onChange={emptyAction.handleChangeCategory}
        >
          Русский набор категорий
        </RadioButton>
        <RadioButton
          checkValue={emptyStore.selectedDefaultCategories}
          name={EMPTY_CATEGORY}
          value={'en'}
          onChange={emptyAction.handleChangeCategory}
        >
          English category set
        </RadioButton>
        <div>
          <Button onClick={emptyAction.handleApplyCategory}>
            {t('firstView.use')}
          </Button>
        </div>
      </div>
      <div>
        <div>{t('firstView.or')}</div>
        <Button onClick={emptyAction.handleOpenSettings}>
          {t('firstView.import')} and upload
        </Button>
      </div>
    </div>
  )
})
