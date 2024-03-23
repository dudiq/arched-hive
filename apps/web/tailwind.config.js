const defaultConfig = require('@repo/ui-kit/default.tailwind.config')

module.exports = {
  ...defaultConfig,
  theme: {
    ...defaultConfig.theme,
    colors: {
      ...defaultConfig.theme.colors,
    },
  },
  // `ui.content` includes a path to the components that are using tailwind in @nori/ui-kit
  content: [...defaultConfig.content, './src/**/*.{ts,tsx}'],
}
