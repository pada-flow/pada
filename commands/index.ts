import chalk from 'chalk'

import { CommanderStatic } from 'commander'

import LoginCommand from './login.command'
import LoginAction from '../actions/login.action'

import ListCommand from './list.command'
import ListAction from '../actions/list.action'

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new LoginCommand(new LoginAction()).load(program);
    new ListCommand(new ListAction()).load(program);

    this.handleInvalidCommand(program);
  }

  // TODO: prettify output & code
  private static handleInvalidCommand(program: CommanderStatic) {
    program.on('command:*', () => {
      console.error(chalk.red('Invalid command: %s'), program.args.join(' '));
      console.log('See --help for a list of available commands.');
      process.exit(1);
    });
  }

}