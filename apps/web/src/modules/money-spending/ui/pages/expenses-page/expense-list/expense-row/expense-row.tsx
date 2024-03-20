import { useEffect, useRef } from 'react'
import { getMoney } from '@pv/i18n'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { Dot } from '../../dot'

import type { ExpenseViewEntity } from '@pv/money-spending/core/expense-view.entity'

type Props = {
  expenseView: ExpenseViewEntity
  isSelected: boolean
  isScrollTo?: boolean
}

export function ExpenseRow({ expenseView, isSelected, isScrollTo }: Props) {
  const { expensesViewStore } = useMoneySpendingContext()
  const date = new Date(expenseView.time)
  const now = new Date()
  const isSameYear = now.getFullYear() === date.getFullYear()

  const time = isSameYear
    ? expensesViewStore.dateFormatter.format(date)
    : expensesViewStore.dateYearFormatter.format(date)
  const hours = date.getHours()
  const rawMinutes = date.getMinutes()
  const minutes = rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes
  const isToday = expenseView.time >= expensesViewStore.startTime

  const refEl = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!isScrollTo) return
    if (!refEl.current) return
    refEl.current.scrollIntoView({
      block: 'center',
      inline: 'center',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="flex w-full py-2 px-4 border-b dark:border-gray-800 border-gray-200"
      data-is-selected={isSelected}
      ref={refEl}
    >
      <div>
        <div>
          {expenseView.catParentTitle ? `${expenseView.catParentTitle} / ` : ''}{' '}
          {expenseView.catTitle}
        </div>
        <div>{expenseView.desc}</div>
      </div>
      <div className="ml-auto text-right">
        <div className="text-xl">{getMoney(expenseView.cost)}</div>
        <div className="text-xs dark:text-gray-500 text-gray-400">
          {time} | {hours}:{minutes}
          {!!isToday && <Dot />}
        </div>
      </div>
    </div>
  )
}
