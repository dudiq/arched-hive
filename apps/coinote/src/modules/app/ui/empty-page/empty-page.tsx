import { t } from '@pv/interface/services/i18n'
import { useAppContext } from '@pv/modules/app/interface/use-app-context'

import { Button, RadioButton } from '@repo/ui-kit'

import {
  Block,
  Container,
  Controls,
  SubTitle,
  Title,
} from './empty-page-styles'

const EMPTY_CATEGORY = 'category'

export function EmptyPage() {
  const { emptyAction, emptyStore } = useAppContext()

  return (
    <Container>
      <Title>{t('firstView.t')}</Title>
      <SubTitle>{t('firstView.select')}</SubTitle>
      <RadioButton
        isChecked={emptyStore.selectedDefaultCategories === 'ru'}
        name={EMPTY_CATEGORY}
        value={'ru'}
        onChange={emptyAction.handleChangeCategory}
      >
        Русский набор категорий
      </RadioButton>
      <RadioButton
        isChecked={emptyStore.selectedDefaultCategories === 'en'}
        name={EMPTY_CATEGORY}
        value={'en'}
        onChange={emptyAction.handleChangeCategory}
      >
        English category set
      </RadioButton>
      <Controls>
        <Button onClick={emptyAction.handleApplyCategory}>
          {t('firstView.use')}
        </Button>
        <Block>{t('firstView.or')}</Block>
        <Button onClick={emptyAction.handleOpenSettings}>
          {t('firstView.import')}
        </Button>
      </Controls>
    </Container>
  )
}
