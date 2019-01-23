import * as inquirer from 'inquirer'
import { Answers, PromptModule, Question } from 'inquirer'
import axios from 'axios'
import * as Ajv from 'ajv'
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

export default class LoginAction extends AbstractAction {
  public async handle(inputs) {
    // const answers: Answers = await promptQuestion(inputs)
    // await this.validateEmailPattern(answers)
    await this.openAADWindow()
  }

  private openAADWindow() {
    return new Promise((resolve, reject) => {
      opn('http://localhost:31544/api/auth/ticket', { app: 'safari', wait: false })
        .then(() => {
          resolve()
        })
        .catch(() => {
          console.log('xxx')
          reject()
        })
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
    axios
      .get('localhost:31544/login')
      .then((res) => {
        console.log('res---', res)
      })
  }
}
