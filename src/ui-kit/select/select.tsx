import { SelectContainer } from './select-styles'

type Option = {
  label: string
  value: string
}

type Props = {
  onChange: (value: string) => void
  options: Option[]
  value: string
}

export function Select({ value, options, onChange }: Props) {
  return (
    <SelectContainer>
      <select
        value={value}
        onChange={(e: any) => {
          onChange(e.target.value)
        }}
      >
        {options.map((option) => {
          return (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </SelectContainer>
  )
}
