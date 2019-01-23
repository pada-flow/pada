import { CommanderStatic } from 'commander'
import { AbstractCommand } from './abstract.command'
import { Input } from '../types/input'

export default class LoginCommand extends AbstractCommand {
  public load (program: CommanderStatic) {
    program
      .command('login')
      .description('Authenticate to Miscosoft AAD')
      .action(async () => {
        const inputs: Input[] = [
          { name: 'email22', value: '' },
        ]
        await this.action.handle(inputs)
      });
  }
}