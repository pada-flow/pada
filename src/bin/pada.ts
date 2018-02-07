import program = require('commander')

const { DEFAULT, ADD, ADD_DESC, LIST, LIST_DESC } = require('./../commandList')
const version = require('./../../package.json')['version']
const nodeVersion: string = process.version.match(/\d+/g)[0]

program
  .version(version, '-v, --version')
  .command(LIST, LIST_DESC, DEFAULT)
  .command(ADD, ADD_DESC)
  .parse(process.argv)

