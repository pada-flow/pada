import chalk from 'chalk'
import { printf } from '../utils'
import { LANG_STEP } from '../utils/customConfig'

const inquirer = require('inquirer')

const fakeResponse = (answer) => {
  const { lang } = answer
  printf(`Configuring language to ${lang}...`)
}

inquirer
  .prompt(LANG_STEP.PICK)
  .then(answer => fakeResponse(answer))
  