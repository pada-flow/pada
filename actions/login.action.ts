import * as inquirer from 'inquirer'
import { Answers, PromptModule, Question } from 'inquirer'
import { throttle } from 'lodash'
import * as os from 'os'
import axios from 'axios'
import * as Ajv from 'ajv'
import * as ora from 'ora'
import chalk from 'chalk'
import opn = require('opn')

import { AbstractAction } from './abstract.action'
import { generateBasicInput } from '../lib/prompt/prompt'
import loginSchema from '../lib/schemas/login.input'

const promptQuestion = async (inputs) => {
  const prompt: PromptModule = inquirer.createPromptModule()
  const questions: Question = inputs.map(input => generateBasicInput(input.name))
  const answers: Answers = await prompt(questions)
  return answers
}
const spinner = ora(chalk.bold.yellow('Waiting for login...'))

export default class LoginAction extends AbstractAction {
  public async handle(inputs) {
    // const answers: Answers = await promptQuestion(inputs)
    // await this.validateEmailPattern(answers)
    spinner.start()
    const ticket = await this.getTicket()
    await this.openAADWindow(ticket)
  }

  private async getTicket(): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .get('http://localhost:31544/api/auth/ticket')
        .then(({ data }) => {
          resolve(data)
        })
    })
  }

  private openAADWindow(ticket): Promise<string> {
    return new Promise((resolve, reject) => {
      opn(`http://localhost:31544/api/auth/login?token=${ticket}`, { wait: true })
      this
        .pollingLoginStatus()
        .then(() => {
          resolve()
        })
    })
  }

  private pollingLoginStatus(): Promise<boolean> {
    console.log('--pollingLoginStatus start'
    )
    return new Promise(async (resolve, reject) => {
      const status = await this.loginStatusCheck()
      if (!status) {
        this.pollingLoginStatus()
      } else {
        resolve()
      }
    })
  }

  /**
   * 检查登录状态
   */
  private loginStatusCheck(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .post('http://localhost:31544/api/auth/status')
          .then(({ data }) => {
            console.log('data---', data)
            resolve(data)
          })
      }, 1000)
    })
  }

  private validateEmailPattern(answers): Promise<boolean> {
    const ajv = new Ajv()
    const validate = ajv.compile(loginSchema)
    return new Promise((resolve, reject) => {
      const valid = validate(answers)
      if (valid) {
        resolve()
        console.log('validate padss')
        return
      }
      console.error('fail', validate.errors)
      process.exit(0)
    })
  }

  private login() {
    
  }
}
