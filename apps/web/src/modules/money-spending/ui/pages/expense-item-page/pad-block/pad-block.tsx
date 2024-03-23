import { t } from '@pv/i18n'

import { observer } from '@repo/service'
import { Icon } from '@repo/ui-kit'

import { ACTIONS_ENUM } from './actions.enum'
import { usePadBlock } from './use-pad-block'

import type { ReactNode } from 'react'

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-1">{children}</div>
  )
}

type ViewType = 'secondary' | 'apply'

const viewMap: Record<ViewType, string> = {
  secondary: 'bg-gray-100 dark:bg-gray-600',
  apply: 'bg-green-300 dark:bg-green-600',
}

function PadButton({
  children,
  disabled,
  widthFill,
  viewType,
  'data-action': dataAction,
  'data-value': dataValue,
}: {
  'data-action'?: ACTIONS_ENUM
  'data-value'?: string
  children: ReactNode
  viewType?: ViewType
  disabled?: boolean
  widthFill?: 'half'
}) {
  const widthClass = widthFill === 'half' ? 'w-56' : 'w-28'
  const bgClass = viewType ? viewMap[viewType] : ''
  return (
    <button
      className={`h-12 border flex items-center justify-center border-gray-200 active:bg-gray-300 active:text-gray-600 active:border-gray-500 dark:border-gray-700 dark:active:bg-gray-600 dark:active:text-gray-800 dark:active:border-gray-500 ${widthClass} ${bgClass}`}
      disabled={disabled}
      data-action={dataAction}
      data-value={dataValue}
    >
      {children}
    </button>
  )
}

export const PadBlock = observer(() => {
  const { handleClick, isEditing } = usePadBlock()
  const updateAction = isEditing ? ACTIONS_ENUM.UPDATE : ACTIONS_ENUM.APPLY
  const plusAction = isEditing ? undefined : ACTIONS_ENUM.PLUS
  return (
    <div className="flex flex-col mx-auto max-w-80 gap-1" onClick={handleClick}>
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
          data-action={plusAction}
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
        <PadButton data-action={updateAction} widthFill="half" viewType="apply">
          {t(isEditing ? 'moneySpending.edit' : 'moneySpending.add')}
        </PadButton>
      </Row>
    </div>
  )
})
