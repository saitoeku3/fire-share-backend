'use strict'

const firebase = require('../lib/firebase')
const bucket = firebase.storage().bucket()

const upload = async req => {
  const { name, path } = req.file
  await bucket.upload(path)
  return { name }
}

exports.upload = upload
