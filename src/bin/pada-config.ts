import { printf } from '../utils'
import { Task } from '../utils/customTyping'
import { SIRI, ADD_STEP } from '../utils/customConfig'
import chalk from 'chalk'
import TaskDB from '../utils/taskDB'
import {
  CONFIG_OPTION_U,
  CONFIG_OPTION_U_DESC,
  CONFIG_OPTION_E,
  CONFIG_OPTION_E_DESC
} from '../commandList'

const program = require('commander')
const inquirer = require('inquirer')
const moment = require('moment')
const dispatchTask = require('../utils/dispatchTask')

const opt = process.argv[2]

const taskDB = new TaskDB()
const user = taskDB.readUser()

const writeUserName = (argvName) => {
  taskDB.updateUser({ nickname: argvName })
  printf('success')
}

const writeEmail = (argvEmail) => {
  taskDB.updateUser({ email: argvEmail })
  printf('success')
}

const handleUser = () => {
  const nickname = user[1]
  const argvName = process.argv[3]
  argvName
    ? writeUserName(argvName)
    : printf(nickname || '')
}

const handleEmail = () => {
  const email = user[2]
  const argvEmail = process.argv[3]
  argvEmail
    ? writeEmail(argvEmail)
    : printf(email || '')
}

!opt && program.help()

program
  .option(CONFIG_OPTION_U, CONFIG_OPTION_U_DESC)
  .option(CONFIG_OPTION_E, CONFIG_OPTION_E_DESC)
  .parse(process.argv)

program.username && handleUser()
program.email && handleEmail()
