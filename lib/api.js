'use babel'

import request from 'request'
import {BufferedProcess} from 'atom'
import {getEnv} from './helpers'

export class API {
  constructor(configPath) {
    this.port = 44877
    this.process = new BufferedProcess({
      command: 'SourceKittenDaemon',
      args: ['start', '--port', this.port, '--project', configPath],
      options: {env: getEnv()},
      stdout: function(buffer) {
        console.debug('KittenDaemon :: stdout', buffer.toString())
      },
      stderr: function(buffer) {
        console.debug('KittenDaemon :: stderr', buffer.toString())
      }
    })
  }
  dispose() {
    this.process.kill()
  }
}
