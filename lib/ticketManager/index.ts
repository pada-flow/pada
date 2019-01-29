import * as os from 'os'
import * as jetpack from 'fs-jetpack'


/**
 * * manage ticket
 * - create if ticket not exist
 * - refresh if ticket expired
 * - read each time
 * @export
 * @class TicketManeger
 */
export default class TicketManeger {
  private readonly path: string

  constructor() {
    const home = os.homedir()
    this.path = `${home}/.pada/ticket`
  }

  /**
   * Ticket content in specified format (utf-8)
   * or undefined if file doesn't exist.
   *
   * @returns {string}
   * @memberof TicketManeger
   */
  public read(): string {
    const file = jetpack.read(this.path)
    return file
  }

  /**
   * Writes ticket to file.
   * If any parent directory in path doesn't exist it will be created
   * @param {string} ticket
   * @memberof TicketManeger
   */
  public write(ticket: string): void {
    jetpack.writeAsync(this.path, ticket)
  }

}
