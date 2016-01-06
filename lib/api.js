'use babel'

import request from 'request'
import {BufferedProcess} from 'atom'
import {getEnv, tempFile} from './helpers'
import {basename} from 'path'

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
  autocomplete(filePath, fileContents, characterIndex) {
    const name = basename(filePath)
    const port = this.port
    return tempFile(name, fileContents, function(tempFile) {
      return new Promise(function(resolve, reject) {
        request({
          url: `http://127.0.0.1:${port}/complete`,
          headers: {
            'X-Offset': characterIndex,
            'X-Path': tempFile,
            'X-File': name
          }
        }, function(error, response, body) {
          if (error) {
            reject(error)
          } else {
            console.log(body.toString(), typeof body);
            resolve([])
          }
        })
      })
      console.log(filePath, tempFile, characterIndex)
    })
  }
  dispose() {
    this.process.kill()
  }
}
