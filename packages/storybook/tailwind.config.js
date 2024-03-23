// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('../../packages/ui-kit/default.tailwind.config.cjs')

module.exports = {
  ...defaultConfig,
  content: [...defaultConfig.content, '../../apps/**/*.{ts,tsx}'],
}
