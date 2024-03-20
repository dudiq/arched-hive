import { t } from '@pv/i18n'

import { observer } from '@repo/service'
import { Icon } from '@repo/ui-kit'

import { ACTIONS_ENUM } from './actions.enum'
import { usePadBlock } from './use-pad-block'

import type { ReactNode } from 'react'

function Row({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function PadButton({
  children,
}: {
  children: ReactNode
  viewType?: string
  disabled?: boolean
  widthFill?: string
}) {
  return <>{children}</>
}

export const PadBlock = observer(() => {
  const { handleClick, isEditing } = usePadBlock()
  return (
    <div onClick={handleClick}>
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
          <Icon name="ALeft" size="big" />
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
          <Icon name="Plus" size="big" />
        </PadButton>
      </Row>
      <Row>
        <PadButton data-action={ACTIONS_ENUM.DOT}>.</PadButton>
        <PadButton data-action={ACTIONS_ENUM.NUMBER} data-value="0">
          0
        </PadButton>
        <PadButton
          data-action={!!isEditing && ACTIONS_ENUM.UPDATE}
          widthFill="half"
          viewType="apply"
        >
          {t(isEditing ? 'moneySpending.edit' : 'moneySpending.add')}
        </PadButton>
      </Row>
    </div>
  )
})
