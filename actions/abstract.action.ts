
import { Input } from '../types/input'

export abstract class AbstractAction {

  public abstract async handle(
    inputs?: Input[],
    options?: Input[],
  ): Promise<void>;

  /**
   * union error handler
   *
   * @param {Error} err
   * @memberof AbstractAction
   */
  public async unionErrorHandler(err: Error) {
    console.error(err)
    process.exit(0)
  }

  public async readUser(): Promise<void> {

  }
}