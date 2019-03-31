'use strict'

const axios = require('axios')
const firebase = require('../lib/firebase')
const bucket = firebase.storage().bucket()

const upload = async req => {
  const { filepath } = req.file
  const filename = filepath.match(/[0-9a-z.?]+\.[a-z]+/)[0]

  await bucket.upload(filepath)

  const signedUrl = await bucket
    .file(filename)
    .getSignedUrl({ action: 'read', expires: '03-17-2025' })

  const { data } = await axios.post(
    `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`,
    { longDynamicLink: `https://fireshare.page.link/?link=${signedUrl[0]}` }
  )

  return { url: data.shortLink }
}

exports.upload = upload
