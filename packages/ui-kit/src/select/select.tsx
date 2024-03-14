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
    <div className="w-full ">
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
    </div>
  )
}
