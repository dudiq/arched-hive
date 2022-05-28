import { useEffect } from 'preact/compat'

function removeLoader() {
  const loaderNode = document.getElementById('loader')
  if (!loaderNode) return
  loaderNode.parentNode?.removeChild(loaderNode)
  const loaderStyles = document.querySelector("[data-type='loader']")

  if (!loaderStyles) return
  loaderStyles.parentNode?.removeChild(loaderStyles)
}

export function Loader() {
  useEffect(() => {
    const timerId = window.setTimeout(removeLoader, 500)
    return () => {
      window.clearTimeout(timerId)
    }
  }, [])
  return null
}
