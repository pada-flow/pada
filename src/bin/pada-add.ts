const fs = require('fs')
const program = require('commander')
const { Task } = require('./../customTyping')
const { printf } = require('utils')

program
  .option('-m, --message', 'commit message')
  .parse(process.argv);

const args = program.args

printf('args--->', args)

if (!args) {
  printf('no argv')
  process.exit(1)
}
const add = () => {
  const detail = {
    status: 12,
    content: 12,
    alarm: 12,
    priority: 12
  }
  const task = new Task(detail)
  console.dir(task)
}
