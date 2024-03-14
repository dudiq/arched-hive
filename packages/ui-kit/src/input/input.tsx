import { useCallback } from 'react'

import type { ChangeEvent } from 'react'

type Props = {
  type?: 'text'
  value?: string
  onChange: (value: string) => void
}

export function Input({ value, type = 'text', onChange }: Props) {
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const target = ev.target
      onChange(target.value)
    },
    [onChange],
  )

  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  )
}
