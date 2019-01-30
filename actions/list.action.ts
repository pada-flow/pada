import * as inquirer from 'inquirer'
import { Answers, PromptModule, Question } from 'inquirer'

import PadaService from '../lib/padaService'
import { AbstractAction } from './abstract.action'

export default class ListAction extends AbstractAction {
  public async handle(inputs) {
    const result = await PadaService.list()
  }
}
