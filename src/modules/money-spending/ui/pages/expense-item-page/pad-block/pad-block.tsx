import { observer } from 'mobx-react-lite'
import { Icon } from '@pv/ui-kit/icon'
import { t } from '@pv/interface/services/i18n'
import { PadButton, Row, Container } from './pad-block-styles'
import { usePadBlock } from './use-pad-block'

export const PadBlock = observer(() => {
  const { handleClick } = usePadBlock()
  return (
    <Container onClick={handleClick}>
      <Row>
        <PadButton data-action="1">1</PadButton>
        <PadButton data-action="2">2</PadButton>
        <PadButton data-action="3">3</PadButton>
        <PadButton data-action="clear" viewType="secondary">
          C
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action="4">4</PadButton>
        <PadButton data-action="5">5</PadButton>
        <PadButton data-action="6">6</PadButton>
        <PadButton data-action="backspace" viewType="secondary">
          <Icon iconName="a-left" iconSize="big" />
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action="7">7</PadButton>
        <PadButton data-action="8">8</PadButton>
        <PadButton data-action="9">9</PadButton>
        <PadButton data-action="plus" viewType="secondary">
          <Icon iconName="plus" iconSize="big" />
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action="dot">.</PadButton>
        <PadButton data-action="0">0</PadButton>
        <PadButton data-action="apply" widthFill="half" viewType="apply">
          {t('moneySpending.add')}
        </PadButton>
      </Row>
    </Container>
  )
})
