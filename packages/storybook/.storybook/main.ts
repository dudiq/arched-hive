import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: [
    '../../ui-kit/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../apps/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  staticDirs: ['../../ui-kit/assets'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack',
    '@storybook/addon-themes',
  ],

  typescript: {
    check: false,
  },
}

export default config
