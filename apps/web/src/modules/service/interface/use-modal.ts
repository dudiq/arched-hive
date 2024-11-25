import { useCallback, useMemo } from 'react'
import { useLocation } from 'wouter'

export function useModal(flag: string) {
  const [pathname, setLocation] = useLocation()

  const searchParams = useMemo(() => {
    return new URLSearchParams(pathname.split('?')[1])
  }, [pathname])

  const basePath = useMemo(() => {
    const value = pathname.split('?')[0]
    if (value.endsWith('/')) return value
    return `${value}/`
  }, [pathname])

  const openValue = `${flag}=open`
  const isOpen = pathname.includes(openValue)

  const handleOpen = useCallback(() => {
    searchParams.set(flag, 'open')
    setLocation(`${basePath}?${searchParams.toString()}`)
  }, [searchParams, flag, pathname, setLocation])

  const handleClose = useCallback(() => {
    searchParams.delete(flag)
    const value = searchParams.toString()
    const params = value ? `?${value}` : ''
    setLocation(`${basePath}${params}`)
  }, [basePath, searchParams, flag, setLocation])

  return {
    isOpen,
    handleOpen,
    handleClose,
  }
}
