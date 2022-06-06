import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'
import { getMoney } from '@pv/interface/services/i18n'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { Dot } from '../dot'
import {
  Container,
  LeftBlock,
  RightBlock,
  Title,
  SubTitle,
  Money,
  DateTitle,
} from './expense-row-styles'

type Props = {
  expenseView: ExpenseViewEntity
}

export function ExpenseRow({ expenseView }: Props) {
  const { moneySpendingStore } = useMoneySpendingContext()
  const date = new Date(expenseView.time)
  const now = new Date()
  const isSameYear = now.getFullYear() === date.getFullYear()

  const time = isSameYear
    ? moneySpendingStore.dateFormatter.format(date)
    : moneySpendingStore.dateYearFormatter.format(date)
  const hours = date.getHours()
  const rawMinutes = date.getMinutes()
  const minutes = rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes
  const isToday = expenseView.time >= moneySpendingStore.startTime

  return (
    <Container>
      <LeftBlock>
        <Title>
          {expenseView.catParentTitle ? `${expenseView.catParentTitle} / ` : ''}{' '}
          {expenseView.catTitle}
        </Title>
        <SubTitle>{expenseView.desc}</SubTitle>
      </LeftBlock>
      <RightBlock>
        <Money>{getMoney(expenseView.cost)}</Money>
        <DateTitle>
          {time} | {hours}:{minutes}
          {isToday && <Dot />}
        </DateTitle>
      </RightBlock>
    </Container>
  )
}
