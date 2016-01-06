'use babel'

module.exports = {
  activate: function() {
    console.log('activate')
  },
  provideAC: function() {
    console.log('provideAC')
    const provider = {
      // TODO: Remove this js scope after publishing
      selector: '.source.swift, .source.js',
      disableForSelector: '.comment',
      getSuggestions: function({editor, bufferPosition}) {
        console.log(editor, bufferPosition)
        return []
      }
    }
    return provider
  }
}
