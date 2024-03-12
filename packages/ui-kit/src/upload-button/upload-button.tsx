import { useCallback } from 'react'

import { Container, Input, Wrapper } from './upload-button-styles'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onChange?: (files: FileList | null) => void
}

export function UploadButton({ children, onChange }: Props) {
  const handleChange = useCallback(
    (e: any) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      onChange && onChange(files)
      target.value = ''
    },
    [onChange],
  )

  return (
    <Container>
      <Wrapper>
        {children}
        <Input onChange={handleChange} type="file" />
      </Wrapper>
    </Container>
  )
}
