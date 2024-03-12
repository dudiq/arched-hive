import { useCallback, useRef } from 'react'

export type IntersectionStateType = 'visible' | 'hidden'

const isIntersectionAvailable = 'IntersectionObserver' in window

type Args = {
  onChange: (state: IntersectionStateType) => void
}

export function useIntersection({ onChange }: Args) {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const handleRef = useRef(onChange)
  handleRef.current = onChange

  const anchorRef = useCallback((node: HTMLDivElement | null) => {
    if (!isIntersectionAvailable) return

    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current)
      observerRef.current.disconnect()
      observerRef.current = null
      elementRef.current = null
    }

    if (!node) return

    elementRef.current = node

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleRef.current('visible')
          return
        }
        handleRef.current('hidden')
      },
      {
        root: null,
        threshold: 0.1, // set offset 0.1 means trigger if atleast 10% of element in viewport
      },
    )

    observer.observe(node)
    observerRef.current = observer
  }, [])

  return {
    anchorRef,
    isIntersectionAvailable,
  }
}
