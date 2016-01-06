'use babel'

import {getPath} from 'consistent-path'

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
