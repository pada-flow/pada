import { printf } from '../utils'
import { Task } from '../utils/customTyping'
import { SIRI, ADD_STEP } from '../utils/customConfig'
import chalk from 'chalk'
import TaskDB from '../utils/taskDB'


// const program = require('commander')
const inquirer = require('inquirer')
const moment = require('moment')
const dispatchTask = require('../utils/dispatchTask')

const taskDB = new TaskDB()

const validateDate = (val) =>
  moment(new Date(val)).isValid()
  || 'Please enter a valid date like YYYY-MM-DD HH:mm:ss'

const validatePriority = (val) => 
  val.includes('!')
  || 'Please enter ! or !! or !!!'

const inquireAdd = [
  ADD_STEP.NOTES,
  Object.assign(ADD_STEP.PRIORITY, { validate: validatePriority, default: '!' }),
  Object.assign(ADD_STEP.DATE, { validate: validateDate, default: moment().format('YYYY-MM-DD HH:mm:ss') })
]

const leave = () => {
  printf('Add task canceled')
  process.exit(1)
}

const write = (answers) => {
  const task = new Task({
    status: 0,
    content: answers.notes,
    alarm: answers.date,
    priority: answers.priority.length
  })
  taskDB.add(task)
  // const result = dispatchTask(task)
  printf(`add task ${chalk.greenBright('success')} 🍻 `)
}

const confirmWrite = (answers) => {
  const { notes, priority, date } = answers
  const message = `Preparing store task: \nnotes: ${chalk.blue(notes)} \npriority: ${priority}\ndate: ${chalk.magenta(date)}\nConfirm to store? `
  const confirm = [{ ...ADD_STEP.CONFIRM, message }]
  inquirer
    .prompt(confirm)
    .then(
      con => con.yes
      ? write(answers)
      : leave()
    )
}

inquirer
  .prompt(inquireAdd)
  .then(answers => { confirmWrite(answers)})

// write({})