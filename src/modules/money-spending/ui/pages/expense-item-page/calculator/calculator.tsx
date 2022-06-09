import { Input } from '@pv/ui-kit/input'
import { useCallback, useState } from 'preact/compat'
import { observer } from 'mobx-react-lite'
import { Button } from '@pv/ui-kit/button'
import { Container, Header } from './calculator-styles'

type Props = {
  cost: number
  desc?: string
  onApply: (result: { cost: number; desc?: string }) => void
}

export const Calculator = observer(({ cost, desc, onApply }: Props) => {
  const [inputValue, setInputValue] = useState(desc)

  const handleApply = useCallback(() => {
    onApply({ desc: inputValue, cost })
  }, [cost, inputValue, onApply])

  return (
    <Container>
      <Header>
        {cost}
        <Input value={inputValue} onChange={setInputValue} />
      </Header>
      <Button onClick={handleApply}>apply</Button>
    </Container>
  )
})
