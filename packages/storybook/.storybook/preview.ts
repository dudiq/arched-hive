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
}

/* snipped for brevity */

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
]

export default preview
