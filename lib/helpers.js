'use babel'

import getEnvironment from 'consistent-env'
export {tempFile} from 'atom-linter'
export function getEnv() {
  return getEnvironment()
}
