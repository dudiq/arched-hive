import { observer } from 'mobx-react-lite'
import { Icon } from '@pv/ui-kit/icon'
import { t } from '@pv/interface/services/i18n'
import { PadButton, Row, Container } from './pad-block-styles'
import { usePadBlock } from './use-pad-block'
import { ACTIONS_ENUM } from './actions.enum'

export const PadBlock = observer(() => {
  const { handleClick } = usePadBlock()
  return (
    <Container onClick={handleClick}>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="1">
          1
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="2">
          2
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="3">
          3
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.clear} viewType="secondary">
          C
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="4">
          4
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="5">
          5
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="6">
          6
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.backspace} viewType="secondary">
          <Icon iconName="a-left" iconSize="big" />
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="7">
          7
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="8">
          8
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="9">
          9
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.plus} viewType="secondary">
          <Icon iconName="plus" iconSize="big" />
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.dot}>.</PadButton>
        <PadButton data-action={ACTIONS_ENUM.number} data-value="0">
          0
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.apply} widthFill="half" viewType="apply">
          {t('moneySpending.add')}
        </PadButton>
      </Row>
    </Container>
  )
})
