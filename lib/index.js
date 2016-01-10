'use babel'

import {CompositeDisposable, Disposable} from 'atom'
import {readdir} from 'fs'
import {join as joinPath} from 'path'
import {API} from './api'

module.exports = {
  activate: function() {
    this.subscriptions = new CompositeDisposable()
    this.api = null

    const paths = atom.project.getPaths()
    if (paths.length) {
      const rootDirectory = paths[0]
      readdir(rootDirectory, (error, files) => {
        if (error) {
          atom.notifications.addError('[autocomplete-swift] Error scanning project root for files, see log for more info')
          console.log('autocomplete-swift scan error', error)
          return
        }
        const filesLength = files.length
        for (let i = 0; i < filesLength; ++i) {
          const file = files[i]
          if (file.endsWith('.xcodeproj')) {
            const filePath = joinPath(rootDirectory, file)
            this.api = new API(filePath)
            this.subscriptions.add(this.api)
          }
        }
      })
    }
  },
  provideAC: function() {
    return {
      selector: '.source.swift',
      disableForSelector: '.comment',
      getSuggestions: ({editor, bufferPosition, prefix}) => {
        const replacementPrefix = prefix.substr(0, 1) === '.' ? prefix.substr(1) : prefix
        if (this.api === null) {
          return []
        }
        const characterIndex = editor.getBuffer().characterIndexForPosition(bufferPosition)
        const fileContents = editor.getText()
        const filePath = editor.getPath()
        return this.api.autocomplete(filePath, fileContents, characterIndex).then(function(results) {
          return results.map(function(result) {
            return {
              text: result.name,
              replacementPrefix: replacementPrefix,
              displayText: result.descriptionKey,
              type: result.typeName,
              leftLabel: result.typeName
            }
          })
        })

      }
    }
  },
  deactivate: function() {
    this.subscriptions.dispose()
    this.api = null
  }
}
