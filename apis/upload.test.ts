'use strict'

const fs = require('fs')
const { ObjectId } = require('mongodb')
const os = require('os')
const path = require('path')
const util = require('util')

const firebase = require('../lib/firebase')
const { upload } = require('./upload')

const access = util.promisify(fs.access)
const bucket = firebase.storage().bucket()
const writeFile = util.promisify(fs.writeFile)

test('upload', async () => {
  const filepath = path.join(os.tmpdir(), `${ObjectId().toString()}.txt`)
  const filename = filepath.match(/[0-9a-z.?]+\.[a-z]+/)[0]
  const req = { file: { filepath } }

  try {
    await access(filepath)
  } catch (e) {
    await writeFile(filepath, '')
  }

  const { url } = await upload(req)
  await bucket.file(filename).delete()

  expect(url).toMatch(/^(https:\/\/fireshare\.page\.link\/).*$/)
})
