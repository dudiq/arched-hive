// import type { LOG_LEVEL } from './packages/logger/src/interface/log-level'

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'

      // LOGGER_LOG_LEVEL: LOG_LEVEL
      LOGGER_TRANSPORT: 'console'
    }
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    ENV: {
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
