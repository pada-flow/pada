import * as inquirer from 'inquirer'
import { Answers, PromptModule, Question } from 'inquirer'

import { AbstractAction } from './abstract.action'

export default class ListAction extends AbstractAction {
  public async handle(inputs) {
    console.log('answers---list')
  }
}
