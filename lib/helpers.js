'use babel'

import {getPath} from 'consistent-path'
export {tempFile} from 'atom-linter'

const assign = Object.assign || function(target, source) {
    for (const key in source) {
      target[key] = source[key]
    }
    return target
  }

export function getEnv() {
  const env = assign({}, process.env)
  env.PATH = getPath()
  return env
}
