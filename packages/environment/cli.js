#!/usr/bin/env node
// eslint-disable-next-line eslint-comments/disable-enable-pair
const { showLogs } = require('./index')
const spawn = require('cross-spawn')
const dotenvExpand = require('dotenv-expand').expand

const argv = require('minimist')(process.argv.slice(2))

function printHelp() {
  // eslint-disable-next-line eslint-comments/no-restricted-disable
  // eslint-disable-next-line no-console
  console.log(
    [
      'Usage: dotenv [--help] [-r [path]] [-- command]',
      '  --help              print help',
      '  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags',
    ].join('\n')
  )
}

if (argv.help) {
  printHelp()
  process.exit()
}

if (argv.r) {
  const [what, to] = argv.r.split(":")
  const populateObj = {
    [what]: process.env[to]
  }
  dotenvExpand({
    parsed: populateObj
  })

  process.env[what] = process.env[to]
  console.log('--populate replacing', {
    [what]: to
  })
}

const command = argv._[0]
if (!command) {
  printHelp()
  process.exit(1)
}

showLogs()

spawn(command, argv._.slice(1), { stdio: 'inherit' }).on(
  'exit',
  function (exitCode, signal) {
    if (typeof exitCode === 'number') {
      process.exit(exitCode)
    } else {
      process.kill(process.pid, signal)
    }
  }
)
