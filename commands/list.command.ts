import { CommanderStatic } from 'commander'
import { AbstractCommand } from './abstract.command'
import { Input } from '../types/input'

export default class ListCommand extends AbstractCommand {
  public load (program: CommanderStatic) {
    program
      .command('list')
      .alias('ls')
      .description('List all tasks')
      .action(async () => {
        await this.action.readUser()
        await this.action.handle()
      })
  }
}
