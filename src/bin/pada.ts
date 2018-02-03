import program = require('commander')

const nodeVersion: string = process.version.match(/\d+/g)[0]
const text: string = '123'

program
  .version('0.0.1', '-v, --version')
  .usage('<command> [options]')

program
  .command('ls, --list', 'Show To Do List')
  .action((name, cmd) => {
    require('../lib/list')(name, cleanArgs(cmd))
  })

program.parse(process.argv)
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = o.long.replace(/^--/, '')
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function') {
      args[key] = cmd[key]
    }
  })
  return args
}
