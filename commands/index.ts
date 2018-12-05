import { CommanderStatic } from 'commander'

import AuthCommand from './auth.command'
import AuthAction from '../actions/auth.action'

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new AuthCommand(new AuthAction()).load(program);
  }
}