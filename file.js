const fs = require('fs')

function wrap(obj, fnName, getWrapper) {
  const original = obj[fnName]
  obj[fnName] = getWrapper(original)
}

wrap(fs, 'writeFile', orig => {
  return function myOwnWrapper() {
    return orig.name === 'myOwnWrapper'
  }
})
