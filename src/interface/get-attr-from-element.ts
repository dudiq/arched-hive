export function getAttrFromElement(el: HTMLElement, attribute: string) {
  let node: Element | null = el
  do {
    if (node.hasAttribute && node.hasAttribute(attribute)) {
      break
    }
  } while ((node = node.parentNode as Element))

  if (node) {
    return node.getAttribute(attribute)
  }
}
