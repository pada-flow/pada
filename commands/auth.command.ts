import { CommanderStatic } from 'commander'
import { AbstractCommand } from './abstract.command'
import { Input } from '../types/input'

export default class AuthCommand extends AbstractCommand {
  public load (program: CommanderStatic) {
    program
      .command('login')
      .description('Authenticate to Miscosoft AAD')
      .action(async () => {
        const inputs: Input[] = [
          { name: 'confirm login ', value: '' },
        ]
        await this.action.handle(inputs)
      });
  }
}