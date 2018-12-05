import * as inquirer from 'inquirer'
import { Answers, PromptModule, Question } from 'inquirer'

import { AbstractAction } from './abstract.action'

const promptQuestion = async (questions) => {
  const prompt: PromptModule = inquirer.createPromptModule();
  const answers: Answers = await prompt(questions)
  return answers
}

export default class AuthAction extends AbstractAction {
  public async handle(inputs) {
    const answers: Answers = await promptQuestion(inputs)
    console.log('answers---', answers)
  }
}