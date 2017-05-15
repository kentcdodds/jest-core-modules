require('./file')
const fs = require('fs')

test('fs.writeFile returns false', () => {
  expect(fs.writeFile()).toBe(false)
})
