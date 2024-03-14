import { useCallback } from 'react'

import type { ReactNode } from 'react'

type Props = {
  name: string
  value: string
  checkValue?: string
  onChange: (value: string) => void
  children: ReactNode
}

export function RadioButton({
  name,
  value,
  checkValue,
  children,
  onChange,
}: Props) {
  const handleChange = useCallback(
    (ev: any) => {
      const value = ev.target.value
      onChange(value)
    },
    [onChange],
  )

  const isChecked = checkValue === value

  return (
    <div>
      <div className="flex items-center mb-4">
        <label>
          <input
            type="radio"
            value={value}
            name={name}
            onChange={handleChange}
            checked={isChecked}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            {children}
          </label>
        </label>
      </div>
    </div>
  )
}
