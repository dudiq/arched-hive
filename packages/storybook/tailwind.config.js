// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('../../packages/ui-kit/default.tailwind.config.cjs')

module.exports = {
  ...defaultConfig,
  darkMode: ['class', '[data-mode="dark"]'],
  content: [...defaultConfig.content, '../../apps/**/*.{ts,tsx}'],
}
