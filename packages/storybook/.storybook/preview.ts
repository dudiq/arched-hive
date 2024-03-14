import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'

import '../../../packages/ui-kit/src/tailwind.base.css'
import '../../../apps/web/src/styles/normalize.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
  ],
}

export default preview
