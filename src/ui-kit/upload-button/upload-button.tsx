import { useCallback } from 'preact/compat'
import { ComponentChildren } from 'preact'
import { Input, Container, Wrapper } from './upload-button-styles'

type Props = {
  children: ComponentChildren
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
