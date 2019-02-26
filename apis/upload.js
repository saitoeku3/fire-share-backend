'use strict'

const firebase = require('../lib/firebase')
const bucket = firebase.storage().bucket()

const upload = async req => {
  const { path } = req.file
  const name = path.match(/[0-9a-z.?]+\.[a-z]+/)[0]

  await bucket.upload(path)
  return { name }
}

exports.upload = upload
