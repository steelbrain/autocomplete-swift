'use babel'

import getEnvironment from 'consistent-env'
export {tempFile} from 'atom-linter'

const assign = Object.assign || function(target, source) {
    for (const key in source) {
      target[key] = source[key]
    }
    return target
  }

export function getEnv() {
  return getEnvironment()
}
