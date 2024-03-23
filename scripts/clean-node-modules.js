const execSync = require('child_process').execSync;

execSync('pnpm turbo run clean:node_modules')
execSync('pnpm rimraf ./node_modules')
