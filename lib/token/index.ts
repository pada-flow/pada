import * as os from 'os'
import jetpack from 'fs-jetpack'

const LogPath = os.homedir()

export /**
 * manage token
 * - create if token not exist
 * - refresh if token expired
 * - read each time
 * @returns {string}
 */
const tokenManeger = function (): string {
  const file = jetpack.read(`${LogPath}/.pada/token`)
  return file
}