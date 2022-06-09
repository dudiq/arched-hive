import { observer } from 'mobx-react-lite'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { t } from '@pv/interface/services/i18n'
import { Dot } from '../dot'
import { Container, Item, Money } from './today-cost-styles'

export const TodayCost = observer(() => {
  const { expensesViewStore } = useMoneySpendingContext()
  return (
    <Container>
      <Item>{t('expense.today')}</Item>
      <Item>
        <Money>
          {expensesViewStore.todayCost}
          <Dot />
        </Money>
      </Item>
    </Container>
  )
})
