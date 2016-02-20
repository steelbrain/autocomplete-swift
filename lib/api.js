'use babel'

import {request} from 'http'
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
        const data = []
        const req = request({
          hostname: '127.0.0.1',
          port: port,
          path: '/complete',
          method: 'GET',
          headers: {
            'X-Offset': characterIndex,
            'X-Path': tempFile,
            'X-File': name
          }
        }, function(res) {
          res.on('error', reject)
          res.on('data', function(chunk) {
            data.push(chunk)
          })
          res.on('end', function() {
            resolve(JSON.parse(data.join('')))
          })
        })
        req.end()
      })
    })
  }
  dispose() {
    this.process.kill()
  }
}
