import { useCallback } from 'react'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onChange?: (files: FileList | undefined) => void
}

export function UploadArea({ children, onChange }: Props) {
  const handleChange = useCallback(
    (e: any) => {
      const target = e.target as HTMLInputElement
      const files = target.files || undefined
      onChange && onChange(files)
      target.value = ''
    },
    [onChange],
  )

  return (
    <label>
      {children}
      <input type="file" className="hidden" onChange={handleChange} />
    </label>
  )
}
