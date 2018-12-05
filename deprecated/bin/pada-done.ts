import chalk from 'chalk'
import { printf } from '../utils'
import { DONE_STEP } from '../utils/customConfig'
import TaskDB from '../utils/taskDB'

const inquirer = require('inquirer')
const commander = require('commander')

const taskDB = new TaskDB()

const argv = process.argv[2]

const doneaTask = (answer) => {
  const id = Number(argv)
  taskDB.done(id)
  printf(`Task ${id} has been marked as done`)
}

const message = () => `Mark task ${argv} as complete?`

if (isNaN(Number(argv))) {
  // printf('Task id must be a number')
  // process.exit(1)
  commander.outputHelp()
  process.exit(1)
}

inquirer
  .prompt({ ...DONE_STEP.CONFIRM, message })
  .then(answer => doneaTask(answer))

