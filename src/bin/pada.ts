import program = require('commander')

const actionList = require('../lib/list')
const actionAdd = require('../lib/add')
const version = require('./../../package.json')['version']
const nodeVersion: string = process.version.match(/\d+/g)[0]

program
  .version(version, '-v, --version')
  .usage('<command> [options]')

program
  .command('ls')
  .description('list all your tasks')
  .action((name, cmd) => {
    actionList()
  })

program
  .command('add')
  .description('add a task in your list')
  .action(() => {
    actionAdd()
  })

program.parse(process.argv)

