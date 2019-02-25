'use strict'

const firebase = require('../lib/firebase')
const fs = require('fs')
const { ObjectId } = require('mongodb')
const os = require('os')
const path = require('path')
const util = require('util')
const { upload } = require('./upload')

const access = util.promisify(fs.access)
const bucket = firebase.storage().bucket()
const writeFile = util.promisify(fs.writeFile)

test('upload', async () => {
  const filepath = path.join(os.tmpdir(), `${ObjectId().toString()}.txt`)
  const req = { file: { path: filepath } }

  try {
    await access(filepath)
  } catch (e) {
    await writeFile(filepath, '')
  }

  const { name } = await upload(req)
  await bucket.file(name).delete()

  expect(name).toMatch(/^[0-9a-z]+(\.txt)$/)
})
