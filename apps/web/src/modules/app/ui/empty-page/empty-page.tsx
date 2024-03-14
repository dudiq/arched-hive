import { useAppContext } from '@pv/app/interface/use-app-context'
import { t } from '@pv/i18n'

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
