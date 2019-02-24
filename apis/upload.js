'use strict'

const firebase = require('../lib/firebase')
const fs = require('fs')
const { ObjectId } = require('mongodb')
const os = require('os')
const path = require('path')
const util = require('util')

const bucket = firebase.storage().bucket()
const writeFile = util.promisify(fs.writeFile)
const tmpdir = os.tmpdir()

// TODO: ファイル形式を指定
const upload = async req => {
  const { content } = req.body
  const filename = `${ObjectId().toString()}.txt`
  const filepath = path.join(tmpdir, filename)

  await writeFile(filepath, content)
  await bucket.upload(filepath)

  return { filename }
}

exports.upload = upload
