import {useCallback} from "react";

export function getAttrFromElement(el: HTMLElement| EventTarget, attribute: string): string | undefined {
  // eslint-disable-next-line eslint-comments/no-restricted-disable
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  let node: Element | null = el
  do {
    if (node && node.hasAttribute && node.hasAttribute(attribute)) {
      break
    }
  } while ((node ? node = node.parentNode as Element : null))

  if (node && node.getAttribute) {
    return node.getAttribute(attribute) || undefined
  }
}

export function useContainerClick(attribute: string, handler: (value?: string) => void) {
  const handleClick = useCallback(
    (e: any) => {
      const value = getAttrFromElement(e.target, attribute)
      handler(value)
    },
    [attribute],
  )

  return handleClick
}
