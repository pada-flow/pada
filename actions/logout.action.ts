import * as inquirer from 'inquirer'
import { Answers, PromptModule, Question } from 'inquirer'
import * as ora from 'ora'
import { Ora } from 'ora'
import chalk from 'chalk'
import opn = require('opn')

import { AbstractAction } from './abstract.action'
import PadaService from '../lib/padaService'
import TicketManager from '../lib/ticketManager'

const ticketManager = new TicketManager()
const spinner = ora(chalk.bold.yellow('Waiting for login...'))

export default class LogoutAction extends AbstractAction {
  private spinner: Ora
  constructor() {
    super()
    this.spinner = ora(chalk.bold.yellow('Waiting for login...'))
  }
  public async handle() {
    this.spinner.start()
    await this.logout()
    this.spinner.succeed('Logout success')
  }

  private async logout(): Promise<void> {
    return await PadaService.logout()
      .then(({ data }) => {
        console.log('logout data---', data)
      })
      .catch((err) => {
        this.unionErrorHandler(err)
      })
  }
}