import { observer } from 'mobx-react-lite'
import { Icon } from '@pv/ui-kit/icon'
import { t } from '@pv/interface/services/i18n'
import { Container, PadButton, Row } from './pad-block-styles'
import { usePadBlock } from './use-pad-block'
import { ACTIONS_ENUM } from './actions.enum'

export const PadBlock = observer(() => {
  const { handleClick, isEditing } = usePadBlock()
  return (
    <Container onClick={handleClick}>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="1">
          1
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="2">
          2
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="3">
          3
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.CLEAR} viewType="secondary">
          C
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="4">
          4
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="5">
          5
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="6">
          6
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.BACKSPACE} viewType="secondary">
          <Icon iconName="a-left" iconSize="big" />
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="7">
          7
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="8">
          8
        </PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="9">
          9
        </PadButton>
        <PadButton
          data-action={isEditing ? '' : ACTIONS_ENUM.PLUS}
          viewType="secondary"
          disabled={isEditing}
        >
          <Icon iconName="plus" iconSize="big" />
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.DOT}>.</PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="0">
          0
        </PadButton>
        <PadButton
          data-action={isEditing ? ACTIONS_ENUM.UPDATE : ACTIONS_ENUM.APPLY}
          widthFill="half"
          viewType="apply"
        >
          {t(isEditing ? 'moneySpending.edit' : 'moneySpending.add')}
        </PadButton>
      </Row>
    </Container>
  )
})
