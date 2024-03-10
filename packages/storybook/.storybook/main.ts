import { dirname, join, resolve } from 'path'

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  swc: (config, options) => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
  stories: [
    '../../ui-kit/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../apps/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  staticDirs: ['../../../apps/web/public', '../../ui-kit/assets'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    '@storybook/addon-styling-webpack',
  ],
  //
  // addons: [
  //   getAbsolutePath("@storybook/addon-links"),
  //   getAbsolutePath("@storybook/addon-essentials"),
  //   getAbsolutePath("storybook-css-modules-preset"),
  //   {
  //     /**
  //      * Fix Storybook issue with PostCSS@8
  //      * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
  //      */
  //     name: '@storybook/addon-postcss',
  //     options: {
  //       postcssLoaderOptions: {
  //         implementation: require('postcss'),
  //       },
  //     },
  //   },
  // ],

  typescript: {
    check: false,
  },

  webpackFinal: async (config) => {
    /**
     * Add support for alias-imports
     * @see https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391
     */
    config.resolve.alias = {
      ...config.resolve?.alias,
      '@': [resolve(__dirname, '../src/'), resolve(__dirname, '../')],
      '~': [
        resolve(__dirname, '../../../apps/web/app'),
        resolve(__dirname, '../../ui-kit/src'),
      ],
    }

    /**
     * Fixes font import with /
     * @see https://github.com/storybookjs/storybook/issues/12844#issuecomment-867544160
     */
    config.resolve.roots = [resolve(__dirname, '../public'), 'node_modules']

    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          },
        },
      ],
      include: resolve(__dirname, '../'),
    })
    return config
  },
}

export default config
