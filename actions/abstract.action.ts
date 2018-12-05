
import { Input } from '../types/input'

export abstract class AbstractAction {
  public abstract async handle(
    inputs?: Input[],
    options?: Input[],
  ): Promise<void>;
}