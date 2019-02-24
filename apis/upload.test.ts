'use strict'

const { upload } = require('./upload')

test('upload', async () => {
  const req = {
    body: {
      content: 'test'
    }
  }
  const { filename } = await upload(req)
  expect(filename).toMatch(/^[0-9a-z]+(\.txt)$/)
})
