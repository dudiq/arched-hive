import { defineConfig } from 'tsup'

import pkg from '../../package.json'

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  define: {
    'process.env._TIME_ENTRY_': String(Date.now()),
    'process.env._APP_NAME_': String(pkg.appName) || '',
    'process.env._VERSION_': String(pkg.version) || '"_"',
    'process.env._COMMIT_HASH_': JSON.stringify(commitHash),
  },
})
