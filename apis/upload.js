'use strict'

const firebase = require('../lib/firebase')

const bucket = firebase.storage().bucket()

// TODO: ファイル形式を指定
const upload = async req => {
  const file = await bucket.upload(req.file)
  return { file }
}

exports.upload = upload
