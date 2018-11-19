import { printf } from '../utils'
import { Task } from '../utils/customTyping'
import { SIRI, DELETE_STEP } from '../utils/customConfig'
import chalk from 'chalk'
import TaskDB from '../utils/taskDB'

const program = require('commander')
const inquirer = require('inquirer')
const moment = require('moment')
const dispatchTask = require('../utils/dispatchTask')

const { DEL_OPTION, DEL_OPTION_DESC } = require('./../commandList')

const taskDB = new TaskDB()

const argv = process.argv[2]

const delMsg = { message: `Delete task ${argv} from database?` }

const inquireDel = [Object.assign(DELETE_STEP.CONFIRM, delMsg)]

const inquireId = [DELETE_STEP.TASKID]

const inquireDelAll = [DELETE_STEP.ALL]

const deleteTask = (answers) => {
  const id = answers.id || argv
  if (!id) return printf(`err when getting taskid!`)

  taskDB.del(id)
  printf(`task deleted!`)
}

const deleteALL = () => {
  taskDB.delAll()
  printf(`All task has been deleted!`)
}

const cancelDel = () => {
  printf(`delete action canceled!`)
}

const deleteSingleTask = () => {
  const inq = argv ? inquireDel : inquireId

  inquirer
    .prompt(inq)
    .then(
      answers => answers.yes || answers.id
        ? deleteTask(answers)
        : cancelDel()
    )
}

const deleteAllTask = () => {
  inquirer
    .prompt(inquireDelAll)
    .then(con => con.yes && deleteALL())
}

program
  .option(DEL_OPTION, DEL_OPTION_DESC)
  .parse(process.argv)
  // .option('-a, --all', 'delete all task from database')

program.all
  ? deleteAllTask()
  : deleteSingleTask()

// write({})