navigator.serviceWorker.register(
  // @ts-ignore
  new URL('sw.js', import.meta.url),
  { type: 'module' },
)
