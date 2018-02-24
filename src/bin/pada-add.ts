import { printf } from '../utils'
import chalk from 'chalk'
import Task from '../customTyping'
// const program = require('commander')
const inquirer = require('inquirer')
const moment = require('moment')
const { ADD_STEP } = require('./../customConfig')
const dispatchTask = require('../utils/dispatchTask')

const validateNotes = (val) => !!val

const validateDate = (val) =>
  moment(new Date(val)).isValid()
  || 'Please enter a valid date like YYYY-MM-DD HH:mm:ss'

const validatePriority = (val) => 
  val.includes('!')
  || 'Please enter ! or !! or !!!'

const inquireAdd = [
  Object.assign(ADD_STEP.NOTES, { validate: validateNotes }),
  Object.assign(ADD_STEP.PRIORITY, { validate: validatePriority, default: '!' }),
  Object.assign(ADD_STEP.DATE, { validate: validateDate, default: moment().format('YYYY-MM-DD HH:mm:ss') })
]

const cancelStore = () => {
  printf('Add task canceled')
  process.exit(1)
}

const confirmStore = (answers) => {
  const task = new Task({
    status: 0,
    content: answers.notes,
    alarm: answers.date,
    priority: answers.priority
  })
  const result = dispatchTask(task)
  console.log('result--->', result)
}

const store = (answers) => {
  const { notes, priority, date } = answers
  const message = `Preparing store task: \nnotes: ${chalk.blue(notes)} \npriority: ${priority}\ndate: ${chalk.magenta(date)}\nConfirm to store? `
  const confirm = [{ ...ADD_STEP.CONFIRM, message }]
  inquirer
    .prompt(confirm)
    .then(
      con => con.yes
      ? confirmStore(answers)
      : cancelStore()
    )
}

inquirer
  .prompt(inquireAdd)
  .then(answers => { store(answers)})

// confirmStore({})