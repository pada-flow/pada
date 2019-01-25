import * as inquirer from 'inquirer'
import { Answers, PromptModule, Question } from 'inquirer'
import * as ora from 'ora'
import chalk from 'chalk'
import opn = require('opn')

import { AbstractAction } from './abstract.action'
import { generateBasicInput } from '../lib/prompt/prompt'
import loginSchema from '../lib/schemas/login.input'
import TicketManager from '../lib/ticketManager'
import PadaService from '../lib/padaService'

// const promptQuestion = async (inputs) => {
//   const prompt: PromptModule = inquirer.createPromptModule()
//   const questions: Question = inputs.map(input => generateBasicInput(input.name))
//   const answers: Answers = await prompt(questions)
//   return answers
// }

const ticketManager = new TicketManager()
const spinner = ora(chalk.bold.yellow('Waiting for login...'))

export default class LoginAction extends AbstractAction {
  private ticket: string

  constructor() {
    super()
    this.ticket = ticketManager.read()
  }

  public async handle(inputs) {
    // const answers: Answers = await promptQuestion(inputs)
    // await this.validateEmailPattern(answers)
    spinner.start()
    await this.validateTicket()
    await this.openAADWindow()
    spinner.succeed('Login success')
  }

  /**
   * 验证本地ticket是否有效
   *
   * @private
   * @returns {Promise<string>}
   * @memberof LoginAction
   */
  private async validateTicket(): Promise<string> {
    return await PadaService.ticket({ params: { ticket: this.ticket }}).then(({ data: ticket }) => {
      if (ticket !== this.ticket) {
        this.ticket = ticket
        ticketManager.write(ticket)
      }
      return ticket
    })
  }

  /**
   * 唤起浏览器 登录微软账号
   *
   * @private
   * @returns {Promise<void>}
   * @memberof LoginAction
   */
  private async openAADWindow(): Promise<void> {
    opn(`http://localhost:31544/api/auth/login?token=${this.ticket}`)
    await this.pollingLoginStatus()
  }

  /**
   * 轮询登录状态
   *
   * @private
   * @returns {Promise<boolean>}
   * @memberof LoginAction
   */
  private async pollingLoginStatus(): Promise<boolean> {
    const status = await this.loginStatusCheck()
    if (!status) {
      await this.pollingLoginStatus()
    } else {
      return true
    }
  }

  /**
   * 检查登录状态
   */
  private loginStatusCheck(): Promise<string> {
    return new Promise((resolve, reject) => {
      const data = { ticket: this.ticket }
      setTimeout(() => {
        PadaService.status(data).then(({ data }) => {
          resolve(data)
        })
      }, 1000)
    })
  }

}
