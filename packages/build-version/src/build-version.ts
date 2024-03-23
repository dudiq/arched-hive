const time = Number(process.env._TIME_ENTRY_) || Date.now()

export const buildVersion = {
  time,
  date: new Date(time),
  appName: process.env._APP_NAME_ ||'',
  version: process.env._VERSION_ ||'',
  hash: process.env._COMMIT_HASH_ || ''
}
