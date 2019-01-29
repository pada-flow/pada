import { CommanderStatic } from 'commander'
import { AbstractCommand } from './abstract.command'

export default class LogoutCommand extends AbstractCommand {
  public load (program: CommanderStatic) {
    program
      .command('logout')
      .description('Logout from ADD')
      .action(async () => {
        await this.action.handle()
      });
  }
}