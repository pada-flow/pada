import program = require('commander')

const {
  DEFAULT,
  ADD,
  ADD_DESC,
  LIST,
  LIST_DESC,
  DEL,
  DEL_DESC,
  DEL_OPTION,
  DEL_OPTION_DESC,
  LANG,
  LANG_DESC,
  DONE,
  DONE_DESC,
  CONFIG,
  CONFIG_DESC
} = require('./../commandList')
const version = require('./../../package.json')['version']
const nodeVersion: string = process.version.match(/\d+/g)[0]

program
  .version(version, '-v, --version')

program
  .command(LIST, LIST_DESC)
  .alias('ls')

program
  .command(ADD, ADD_DESC)
  .alias('a')

program
  .command(DEL, DEL_DESC)
  .alias('d')

program
  .command(LANG, LANG_DESC)

program
  .command(DONE, DONE_DESC)

program
  .command(CONFIG, CONFIG_DESC)

program.parse(process.argv)

