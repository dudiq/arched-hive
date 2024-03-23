#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const spawn = require('cross-spawn')

spawn('vitest', ['run', '--passWithNoTests'], { stdio: 'inherit' }).on(
  'exit',
  function (exitCode, signal) {
    if (typeof exitCode === 'number') {
      process.exit(exitCode)
    } else {
      process.kill(process.pid, signal)
    }
  }
)
